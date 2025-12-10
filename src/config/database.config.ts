import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.connectDB();
    } catch (err) {
      throw new Error('Method not implemented.');
    }
  }

  async connectDB() {
    try {
      await mongoose.connect(
        'mongodb+srv://soumadippal30_db_user:G5QngIyKM83RypQo@healtcarecluster.erfcjki.mongodb.net/	',
      );
      console.log('Connected to MongoDB Atlas');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    }
  }
}
