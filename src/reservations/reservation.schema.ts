import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Space', required: true }) space: Types.ObjectId;
  @Prop({ required: true }) startAt: Date;
  @Prop({ required: true }) endAt: Date;
  @Prop({ default: 'booked' }) status: string; // booked, paid, checked_in, checked_out, cancelled, no_show
  @Prop({ default: 0 }) price: number;
  @Prop() razorpayOrderId: string;
  @Prop() razorpayPaymentId: string;
}
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
