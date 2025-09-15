// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class PaymentsService {
  private razor: any;

  constructor(private reservationsService: ReservationsService) {
    this.razor = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create Razorpay order — amount must be in paise (1 INR = 100 paise)
  async createOrder(reservationId: string, amountInPaise: number) {
    const order = await this.razor.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: String(reservationId),
      payment_capture: 1, // automatic capture
    });

    // Save order id to reservation
    await this.reservationsService.updateOrder(reservationId, order.id, amountInPaise);

    return order;
  }

  // Verify webhook signature. Use webhook secret if set; fallback to key secret for local tests
  verifySignature(rawBody: Buffer | string, signature: string): boolean {
  const secret =
    process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error('Razorpay secret not configured in environment variables');
  }

  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return digest === signature;
}

}
