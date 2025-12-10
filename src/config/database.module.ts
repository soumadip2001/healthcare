import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://soumadippal30_db_user:G5QngIyKM83RypQo@healtcarecluster.erfcjki.mongodb.net/',
    ),
  ],
})
export class DatabaseModule {}
