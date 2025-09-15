import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from './space.schema';

@Injectable()
export class SpacesService {
  constructor(@InjectModel(Space.name) private spaceModel: Model<SpaceDocument>) {}

  async create(spaceData: any) {
    try {
      // Map title -> name and provide default owner
      const space = new this.spaceModel({
        ...spaceData,
        name: spaceData.title || 'Untitled Space',
        owner: spaceData.owner || 'guest_owner',
      });
      return await space.save();
    } catch (err) {
      console.error('Database save failed:', err);
      throw new Error('Failed to save space: ' + err.message);
    }
  }

  async findAll() {
    return this.spaceModel.find().exec();
  }

  async findById(id: string) {
    return this.spaceModel.findById(id).exec();
  }

  async update(id: string, spaceData: any) {
    return this.spaceModel.findByIdAndUpdate(id, spaceData, { new: true }).exec();
  }

  async remove(id: string) {
    return this.spaceModel.findByIdAndDelete(id).exec();
  }
}
