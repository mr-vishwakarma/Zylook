import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Outfit title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        role: {
          type: String,
          enum: ['topwear', 'bottomwear', 'footwear', 'accessories', 'outerwear', 'ethnic'],
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['casual', 'formal', 'ethnic', 'party', 'seasonal', 'streetwear'],
    },
    occasion: [String],           // e.g. ['wedding', 'office', 'date-night']
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    images: [String],             // Gallery images
    totalPrice: {
      type: Number,
      required: true,
    },
    bundlePrice: {
      type: Number,
      required: true,              // Discounted price for buying the full outfit
    },
    savings: {
      type: Number,
      default: 0,                  // totalPrice - bundlePrice
    },
    tags: [String],
    season: {
      type: String,
      enum: ['summer', 'monsoon', 'winter', 'all-season'],
      default: 'all-season',
    },
    curatedBy: {
      type: String,
      enum: ['ai', 'stylist', 'creator', 'brand'],
      default: 'stylist',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',                 // If curated by a creator
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
outfitSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual: calculate savings before save
outfitSchema.pre('save', function (next) {
  this.savings = this.totalPrice - this.bundlePrice;
  next();
});

const Outfit = mongoose.model('Outfit', outfitSchema);
export default Outfit;
