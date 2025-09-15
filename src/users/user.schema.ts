import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'consumer' | 'brand_owner' | 'staff';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['consumer', 'brand_owner', 'staff'] })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
