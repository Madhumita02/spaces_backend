import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }
  async validate(payload: any) {
    // payload.sub is user id
    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;
    // remove password if present
    const obj = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
    delete obj.password;
    return obj;
  }
}
