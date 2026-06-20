import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['topwear', 'bottomwear', 'footwear', 'accessories', 'outerwear', 'ethnic'],
    },
    brand: {
      type: String,
      default: 'Zylook',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    images: [String],
    sizes: [
      {
        size: String,       // e.g. 'S', 'M', 'L', 'XL', '42'
        stock: { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        name: String,       // e.g. 'Navy Blue'
        hex: String,        // e.g. '#1a237e'
      },
    ],
    tags: [String],          // e.g. ['summer', 'casual', 'trending']
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    material: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
