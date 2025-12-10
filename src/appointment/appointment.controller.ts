import { Controller, Get, Body, Patch, Query, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  UpdateAppointmentByADMINDoctorDto,
  UpdateAppointmentDto,
} from './dto/update-appointment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Currentuser } from 'src/common/auth.decorator';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Rolename } from 'src/config/enum.config';
import { RolesGuard } from 'src/common/guard/role.guard';

@ApiTags('Appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // @Post()
  // create(@Body() createAppointmentDto) {
  //   return this.appointmentService.create();
  // }

  //List of all doctor
  @ApiOperation({ summary: 'Patient can watch List of doctor' })
  @Get('doctor-list')
  findAll() {
    return this.appointmentService.getListofAllDoctors();
  }

  // appointment list for specific doctor
  @ApiOperation({
    summary: 'Patient can watch appointment timing with there booking status',
  })
  @Get('appointment-doctor-list')
  getAllAppointmentListByDoctorId(@Query('doctorid') id: string) {
    return this.appointmentService.findAppointmentListBYDoctor(id);
  }

  // BookSlot By patient which takes appointmentid and update appointment status and patientid with reason
  @ApiOperation({
    summary: 'Patient can book appointment of a particular doctor',
  })
  @Patch('appointment-update')
  update(@Query('appointmentid') appointmentid: string, @Currentuser() user) {
    // take the patientid from custom decorator
    return this.appointmentService.update(appointmentid, user.sub);
  }

  // update appointmentInfo By Admin
  @ApiOperation({
    summary:
      'Admin Api for booking cancelling appointment of a particular patient',
  })
  @Roles(Rolename.Admin)
  @Patch('/admin/appointment-update')
  updateByAdmin(
    @Query('appointmentid') appointmentid: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateByAdmin(
      appointmentid,
      updateAppointmentDto.patientid,
      updateAppointmentDto.appointmentstatus,
    );
  }

  @ApiOperation({
    summary: 'Api for doctor who can update the patient prescription',
  })
  @Roles(Rolename.Admin, Rolename.Doctor)
  @Patch('/prescription/appointment-update')
  updateByAdminAndDoctor(
    @Query('appointmentid') appointmentid: string,
    @Body() updateAppointmentDto: UpdateAppointmentByADMINDoctorDto,
  ) {
    return this.appointmentService.updateByDoctor(
      appointmentid,
      updateAppointmentDto.prescription,
    );
  }

  @ApiOperation({
    summary: 'Api for doctor to see there booking info of the current day',
  })
  @Roles(Rolename.Doctor)
  @Get('/bookingInfo')
  getBookingInfoFromDoctor(
    @Currentuser() user,
    @Query('date') givendate: string,
  ) {
    return this.appointmentService.getstausInfoByDoctor(user.sub, givendate);
  }

  // Total appointment booked
  @ApiOperation({
    summary: 'Admin and doctor can see the analatics of the day',
  })
  @Roles(Rolename.Admin, Rolename.Doctor)
  @Get('annalytics')
  getAnalyticsByDay(
    @Query('startdate') startdate: string,
    @Query('enddate') enddate: string,
  ) {
    return this.appointmentService.getAnnalytics(startdate, enddate);
  }

  @Roles(Rolename.Admin)
  @Patch('/admin/role')
  updateRoleByAdmin(
    @Query('userid') userid: string,
    @Query('rolename') rolename: string,
  ) {
    return this.appointmentService.updateRoleByAdmin(userid, rolename);
  }

  @Roles(Rolename.Admin)
  @Get('/admin/allrole')
  getAllrole() {
    return this.appointmentService.getAllrole();
  }
}
