// src/data/data.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('data/:collectionName')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  async create(
    @Param('collectionName') collectionName: string, 
    @Body() createDto: any,
    @Req() request: Request // Injecting request to get user info
  ) {
    const userId = request.user.userId; // Getting user ID from token
    return this.dataService.create(collectionName, createDto, userId);
  }

  @Get()
  async findAll(@Param('collectionName') collectionName: string) {
    return this.dataService.findAll(collectionName);
  }

  @Put(':id')
  async update(
    @Param('collectionName') collectionName: string, 
    @Param('id') id: string, 
    @Body() updateDto: any,
    @Req() request: Request // Injecting request to get user info
  ) {
    const userId = request.user.userId; // Getting user ID from token
    return this.dataService.update(collectionName, id, updateDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('collectionName') collectionName: string, 
    @Param('id') id: string
  ) {
    return this.dataService.remove(collectionName, id);
  }
}
