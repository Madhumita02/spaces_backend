// src/reservations/reservations.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(@InjectModel(Reservation.name) private resModel: Model<ReservationDocument>) {}

  async create(userId: string, dto: any) {
    const { space, startAt, endAt } = dto;
    const overlapping = await this.resModel.findOne({
      space,
      $or: [
        { startAt: { $lt: new Date(endAt) }, endAt: { $gt: new Date(startAt) } },
      ],
      status: { $in: ['booked', 'paid', 'checked_in'] },
    });
    if (overlapping) throw new BadRequestException('Time slot not available');
    const r = new this.resModel({ ...dto, user: userId });
    return r.save();
  }

  findByUser(userId: string) {
    return this.resModel.find({ user: userId }).populate('space').exec();
  }

  findById(id: string) {
    return this.resModel.findById(id).exec();
  }

  async updateStatus(id: string, status: string) {
    return this.resModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  // Save Razorpay order id & amount on the reservation
  async updateOrder(reservationId: string, razorpayOrderId: string, amountInPaise?: number) {
    return this.resModel.findByIdAndUpdate(reservationId, { razorpayOrderId, price: amountInPaise || undefined }, { new: true }).exec();
  }

  // Called when Razorpay confirms payment; find reservation by order id and mark paid
  async markPaidByOrder(razorpayOrderId: string, razorpayPaymentId: string) {
    const r = await this.resModel.findOne({ razorpayOrderId }).exec();
    if (!r) {
      // optionally log: no reservation found
      return null;
    }
    r.razorpayPaymentId = razorpayPaymentId;
    r.status = 'paid';
    return r.save();
  }
}
