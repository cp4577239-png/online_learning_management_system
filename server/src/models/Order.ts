import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, maxlength: 180 },
    price: { type: Number, min: 0, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, min: 0, required: true },
    discount: { type: Number, min: 0, required: true },
    total: { type: Number, min: 0, required: true },
    couponApplied: { type: String, default: null },
    paymentMethod: { type: String, enum: ['razorpay', 'card', 'upi', 'wallet'], required: true },
    status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], required: true },
  },
  { timestamps: true, versionKey: false },
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.set('toJSON', { virtuals: true });

export const OrderModel = model('Order', orderSchema);
