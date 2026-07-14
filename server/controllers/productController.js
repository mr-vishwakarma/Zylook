import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { uploadToImageKit } from '../utils/uploadToImageKit.js';

/**
 * @desc    Get all products (paginated, with search + filters)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      gender,
      brand,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      isActive,
    } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      products,
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
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Admin only
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      gender,
      material,
      tags,
      sizes,
      colors,
    } = req.body;

    if (!name || !category || price === undefined) {
      throw new ApiError('Name, category, and price are required', 400);
    }

    // Upload images to ImageKit if files are present
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToImageKit(
          file.buffer,
          `product-${Date.now()}-${file.originalname}`,
          '/zylook/products'
        );
        imageUrls.push(result.url);
      }
    }

    // Parse JSON strings from form-data
    const parsedSizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [];
    const parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [];
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

    const product = await Product.create({
      name,
      description: description || '',
      category,
      brand: brand || 'Zylook',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images: imageUrls,
      sizes: parsedSizes,
      colors: parsedColors,
      tags: parsedTags,
      gender: gender || 'unisex',
      material: material || '',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Admin only
 */
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImageUrls = [];
      for (const file of req.files) {
        const result = await uploadToImageKit(
          file.buffer,
          `product-${Date.now()}-${file.originalname}`,
          '/zylook/products'
        );
        newImageUrls.push(result.url);
      }

      // Append new images to existing (or replace if 'replaceImages' flag is set)
      if (req.body.replaceImages === 'true') {
        req.body.images = newImageUrls;
      } else {
        req.body.images = [...product.images, ...newImageUrls];
      }
    }

    // Parse JSON strings from form-data
    if (req.body.sizes && typeof req.body.sizes === 'string') {
      req.body.sizes = JSON.parse(req.body.sizes);
    }
    if (req.body.colors && typeof req.body.colors === 'string') {
      req.body.colors = JSON.parse(req.body.colors);
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.discountPrice) req.body.discountPrice = Number(req.body.discountPrice);

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete (deactivate) a product
 * @route   DELETE /api/products/:id
 * @access  Admin only
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Soft delete — set isActive to false
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
