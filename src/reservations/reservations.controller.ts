import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  // Consumers can create reservations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('consumer')
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.reservationsService.create(req.user._id || req.user.sub, body);
  }

  // Logged-in user can see their reservations
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@Req() req: any) {
    return this.reservationsService.findByUser(req.user._id || req.user.sub);
  }
}
