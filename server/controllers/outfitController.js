import Outfit from '../models/Outfit.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { uploadToImageKit } from '../utils/uploadToImageKit.js';

/**
 * @desc    Get all outfits (paginated, with filters)
 * @route   GET /api/outfits
 * @access  Public
 */
export const getOutfits = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      season,
      occasion,
      sort = '-createdAt',
      isActive,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (season) query.season = season;
    if (occasion) query.occasion = { $in: occasion.split(',') };
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [outfits, total] = await Promise.all([
      Outfit.find(query)
        .populate('items.product', 'name price images category brand')
        .populate('creator', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Outfit.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      outfits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured outfits (homepage feed)
 * @route   GET /api/outfits/featured
 * @access  Public
 */
export const getFeaturedOutfits = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const outfits = await Outfit.find({ isFeatured: true, isActive: true })
      .populate('items.product', 'name price images category brand')
      .sort('-createdAt')
      .limit(limit)
      .lean();

    res.status(200).json({ success: true, outfits });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search outfits (text search)
 * @route   GET /api/outfits/search
 * @access  Public
 */
export const searchOutfits = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      throw new ApiError('Search query is required', 400);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      $text: { $search: q },
      isActive: true,
    };

    const [outfits, total] = await Promise.all([
      Outfit.find(query, { score: { $meta: 'textScore' } })
        .populate('items.product', 'name price images category brand')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Outfit.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      outfits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single outfit by ID
 * @route   GET /api/outfits/:id
 * @access  Public
 */
export const getOutfitById = async (req, res, next) => {
  try {
    const outfit = await Outfit.findById(req.params.id)
      .populate('items.product')
      .populate('creator', 'name avatar')
      .lean();

    if (!outfit) {
      throw new ApiError('Outfit not found', 404);
    }

    // Increment view count (fire-and-forget)
    Outfit.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({ success: true, outfit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new outfit combo
 * @route   POST /api/outfits
 * @access  Admin / Creator
 */
export const createOutfit = async (req, res, next) => {
  try {
    const {
      title,
      description,
      items,       // JSON array: [{ product: "id", role: "topwear" }, ...]
      category,
      occasion,
      gender,
      season,
      bundlePrice,
      tags,
      curatedBy,
      isFeatured,
    } = req.body;

    if (!title || !category || !bundlePrice) {
      throw new ApiError('Title, category, and bundle price are required', 400);
    }

    // Parse items from form-data
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    const parsedOccasion = occasion ? (typeof occasion === 'string' ? JSON.parse(occasion) : occasion) : [];
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

    if (!parsedItems || parsedItems.length === 0) {
      throw new ApiError('At least one product item is required', 400);
    }

    // Calculate total MRP from product prices
    const productIds = parsedItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== productIds.length) {
      throw new ApiError('One or more product IDs are invalid', 400);
    }

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

    // Upload cover image to ImageKit
    let coverImageUrl = '';
    if (req.file) {
      const result = await uploadToImageKit(
        req.file.buffer,
        `outfit-cover-${Date.now()}-${req.file.originalname}`,
        '/zylook/outfits'
      );
      coverImageUrl = result.url;
    } else if (req.body.coverImage) {
      coverImageUrl = req.body.coverImage; // Existing URL passed directly
    }

    if (!coverImageUrl) {
      throw new ApiError('Cover image is required', 400);
    }

    const outfit = await Outfit.create({
      title,
      description: description || '',
      items: parsedItems,
      category,
      occasion: parsedOccasion,
      gender: gender || 'unisex',
      coverImage: coverImageUrl,
      totalPrice,
      bundlePrice: Number(bundlePrice),
      tags: parsedTags,
      season: season || 'all-season',
      curatedBy: curatedBy || 'stylist',
      creator: req.user._id,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    // Populate items for the response
    await outfit.populate('items.product', 'name price images category brand');

    res.status(201).json({ success: true, outfit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an outfit
 * @route   PUT /api/outfits/:id
 * @access  Admin / Creator
 */
export const updateOutfit = async (req, res, next) => {
  try {
    let outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      throw new ApiError('Outfit not found', 404);
    }

    // Handle cover image upload
    if (req.file) {
      const result = await uploadToImageKit(
        req.file.buffer,
        `outfit-cover-${Date.now()}-${req.file.originalname}`,
        '/zylook/outfits'
      );
      req.body.coverImage = result.url;
    }

    // Parse JSON strings from form-data
    if (req.body.items && typeof req.body.items === 'string') {
      req.body.items = JSON.parse(req.body.items);
    }
    if (req.body.occasion && typeof req.body.occasion === 'string') {
      req.body.occasion = JSON.parse(req.body.occasion);
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.bundlePrice) req.body.bundlePrice = Number(req.body.bundlePrice);

    // Recalculate total price if items changed
    if (req.body.items) {
      const productIds = req.body.items.map((item) => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).lean();
      req.body.totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    }

    outfit = await Outfit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('items.product', 'name price images category brand');

    res.status(200).json({ success: true, outfit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an outfit
 * @route   DELETE /api/outfits/:id
 * @access  Admin only
 */
export const deleteOutfit = async (req, res, next) => {
  try {
    const outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      throw new ApiError('Outfit not found', 404);
    }

    // Soft delete
    outfit.isActive = false;
    await outfit.save();

    res.status(200).json({
      success: true,
      message: 'Outfit deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
