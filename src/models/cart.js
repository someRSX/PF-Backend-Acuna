import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
      },
      quantity: { 
        type: Number, 
        default: 1, 
        min: [1, 'La cantidad debe ser al menos 1']
      },
    },
  ],
}, { timestamps: true });

cartSchema.pre('save', function(next) {
  const validProductIds = this.products.map(item => item.product);
  if (!validProductIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
    return next(new Error('Uno o más identificadores de productos no son válidos'));
  }
  next();
});

export const Cart = mongoose.model('Cart', cartSchema);