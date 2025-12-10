import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { AppointmentStatus } from 'src/config/enum.config';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Patient ID who booked the appointment',
    type: String,
    required: true
  })
  @IsString()
  patientid: string;

  @ApiPropertyOptional({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    default: AppointmentStatus.Available,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  appointmentstatus?: AppointmentStatus.Available;
}

export class UpdateAppointmentByADMINDoctorDto {
  @ApiProperty({
    description: 'Patient ID who booked the appointment',
    type: String,
    required: true
  })
  @IsString()
  patientid: string;

  @ApiPropertyOptional({
    description: 'update prescription of the appointment',
    type: String,
    required: false,
  })
  @IsString()
//   @IsOptional()
  prescription: string | null = null;
}