
import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DataService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly jwtService: JwtService,
  ) {}

  getModel(collectionName: string): Model<any> {
    const schemaDefinition = new Schema(
      {
        any: {},
        created_on: { type: Date},
        created_by: { type: String },
        updated_on: { type: Date},
        updated_by: { type: String },
      },
      { strict: false }
    );

    if (this.connection.models[collectionName]) {
      return this.connection.model(collectionName);
    }

    return this.connection.model(collectionName, schemaDefinition, collectionName);
  }

  async create(collectionName: string, createDto: any, userId: string): Promise<any> {
    const model = this.getModel(collectionName);
    const createdDocument = new model({
      ...createDto,
      created_by: userId, // Add userId to created_by
      created_on: new Date(), // Add created_on date
    });
    return createdDocument.save();
  }

  async update(collectionName: string, id: string, updateDto: any, userId: string): Promise<any> {
    const model = this.getModel(collectionName);
    const updatedDocument = await model.findByIdAndUpdate(
      id,
      {
        ...updateDto,
        updated_on: new Date(), // Update updated_on date
        updated_by: userId, // Add userId to updated_by
      },
      { new: true }
    ).exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return updatedDocument;
  }

  async findAll(collectionName: string): Promise<any[]> {
    const model = this.getModel(collectionName);
    return model.find().exec();
  }

  async remove(collectionName: string, id: string): Promise<any> {
    const model = this.getModel(collectionName);
    return model.findByIdAndDelete(id).exec();
  }
}
