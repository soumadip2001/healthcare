import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus } from 'src/config/enum.config';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: String, required: false })
  patientid?: string; // Customer who booked (optional)

  @Prop({ type: String })
  doctorid: string; // Customer who booked

  @Prop({ type: String })
  prescription: Types.ObjectId; // Optional staff assigned

  @Prop({ type: String, required: false })
  reason?: string; // Optional service booked

  @Prop({ required: true })
  appointmentdate: Date; // Date of appointment

  @Prop({ required: true })
  starttime: string; // Exact start time

  @Prop({ required: true })
  endtime: string; // Exact end time

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.Available,
  })
  status: string; // Appointment status

  @Prop({ default: false })
  isdeleted: boolean; // Soft delete
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
