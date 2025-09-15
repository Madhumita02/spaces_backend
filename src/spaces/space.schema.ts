import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpaceDocument = Space & Document;

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop() category: string;
  @Prop() address: string;
  @Prop() mapsLink: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() postalCode: string;
  @Prop() capacity: number;
  @Prop() seating: string;
  @Prop() areaSize: string;
  @Prop([String]) amenities: string[];
  @Prop([String]) images: string[];
  @Prop([String]) videos: string[];
  @Prop() virtualTour: string;
  @Prop() houseRules: string;
  @Prop() availability: string;
  @Prop({ required: true }) contact: string;
  @Prop() tags: string;
  @Prop({ type: String, required: true }) owner: string;
  @Prop({ default: 0 }) hourlyRate: number;
  @Prop({ default: 0 }) dailyRate: number;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
