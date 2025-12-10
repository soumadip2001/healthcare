import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Roles extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: true })
  isdefault: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Roles);
