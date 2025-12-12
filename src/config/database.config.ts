import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.connectDB();
    } catch (err) {
      console.log(err);

      throw new Error('Method not implemented.');
    }
  }

  async connectDB() {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        console.error('MONGO_URI environment variable is not set');
        process.exit(1);
      }
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Atlas');
    } catch (err: any) {
      console.error('MongoDB connection failed:', err);
      process.exit(1);
    }
  }
}
