import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        outfit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Outfit',
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        selectedSize: String,
        selectedColor: String,
        isOutfit: {
          type: Boolean,
          default: true, // true = buying full outfit, false = individual product
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Recalculate totals before save
cartSchema.pre('save', function () {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.totalItems = this.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
