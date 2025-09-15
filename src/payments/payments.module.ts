import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule], // needs ReservationsService
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
