// src/payments/payments.controller.ts
import { Controller, Post, Body, Req, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ReservationsService } from '../reservations/reservations.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private reservationsService: ReservationsService,
  ) {}

  // Create an order for a reservation. Protected in production; keep it simple for testing
  @Post('create-order')
  async createOrder(@Body() body: { reservationId: string; amount: number }) {
    const { reservationId, amount } = body;
    if (!reservationId || !amount) throw new HttpException('reservationId and amount required', HttpStatus.BAD_REQUEST);
    // amount expected in paise
    const order = await this.paymentsService.createOrder(reservationId, amount);
    return { orderId: order.id, amount: order.amount, currency: order.currency, razorpayKeyId: process.env.RAZORPAY_KEY_ID };
  }

  // Webhook endpoint. Must receive raw body; main.ts configured this route to use express.raw()
  @Post('webhook')
  async webhook(@Req() req: any, @Headers('x-razorpay-signature') signature: string) {
    const rawBody = req.body; // Buffer from express.raw
    if (!signature) {
      throw new HttpException('Missing signature header', HttpStatus.BAD_REQUEST);
    }
    const ok = this.paymentsService.verifySignature(rawBody, signature);
    if (!ok) {
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
    }

    // Parse event and handle
    const event = JSON.parse(rawBody.toString('utf8'));
    // Example: handle payment captured
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      if (orderId) {
        // mark reservation paid using order id
        await this.reservationsService.markPaidByOrder(orderId, paymentId);
      }
    }

    // respond 200 to Razorpay
    return { ok: true };
  }
}
