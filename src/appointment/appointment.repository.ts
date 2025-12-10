import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './schema/appointment.schema';
import { Model } from 'mongoose';
import { User } from 'account-user/schema/account-user.schema';
import { Roles } from 'src/common/schema/roles.schema';
import { AppointmentStatus } from 'src/config/enum.config';
import { appointmentInfo } from './interface/appointment.interface';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Roles.name) private readonly rolesModel: Model<Roles>,
  ) {}
  async getListOfuserByroleid(roleId: string | null) {
    const userslist = await this.userModel.find({ roleId }).lean();
    return userslist;
  }

  async getRoleInfo(role: string) {
    const roleInfo = await this.rolesModel
      .find({ name: role })
      .populate('_id', 'name isdefault')
      .lean();
    return roleInfo;
  }

  async getAppointmentListByDoctorId(doctorid: string) {
    const AppInfo = await this.appointmentModel
      .find({ doctorid })
      // .populate('_id', 'name isdefault')
      .lean();
    return AppInfo;
  }

  async getandUpdateAppointInfoById(
    appointid: string,
    patientid: string,
    status: string,
  ) {
    const updatedAppoint = await this.appointmentModel
      .findByIdAndUpdate(
        appointid, // find by _id only
        { patientid: patientid, status }, // update patientId and status
        { new: true }, // return the updated document
      )
      .lean();

    return updatedAppoint;
  }

  async getandUpdateAppointPrescriptionInfoById(
    appointid: string,
    prescription: string | null,
  ) {
    const updatedAppoint = await this.appointmentModel
      .findByIdAndUpdate(
        appointid, // find by _id only
        { prescription, status: AppointmentStatus.Complete }, // update patientId and status
        { new: true }, // return the updated document
      )
      .lean();

    return updatedAppoint;
  }

  async createAppointment(appointmentInfo: appointmentInfo) {
    try {
    const appointment = new this.appointmentModel({
      patientid: appointmentInfo.patientid,
      doctorid: appointmentInfo.doctorid,
      appointmentdate: appointmentInfo.appointmentdate,
      starttime: appointmentInfo.starttime, // "09:00"
      endtime: appointmentInfo.endtime, // "09:30"
      status: AppointmentStatus.Available,
      reason: appointmentInfo.reason || '',
      prescription: appointmentInfo.prescription || null,
      isdeleted: false,
    });

    const savedAppointment = await appointment.save();
    return savedAppointment;
    } catch (err) {
      throw new HttpException('error', 400);
    }
  }

  async getappointByid(id: string) {
    const appointmentInfo = await this.appointmentModel.findById(id).lean();
    return appointmentInfo;
  }

  async getBookingInfoByDateAndDoctor(
    doctorid: string,
    date: string, // format: "yyyy-mm-dd"
    appointmentstatus?: string,
  ) {
    const filter: any = {
      doctorid,
      appointmentdate: date,
    };

    if (appointmentstatus) {
      filter.status = appointmentstatus;
    }

    const appointmentInfo = await this.appointmentModel.find(filter).lean();

    return appointmentInfo;
  }

  async getAppointmentsPerDayByStatus(
    startDate: string | null,
    endDate: string | null,
  ) {
    const result = await this.appointmentModel.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate, $lte: endDate },
          status: {
            $in: [
              AppointmentStatus.Booked,
              AppointmentStatus.Complete,
              AppointmentStatus.Cancelled,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$appointmentdate' },
            },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1, '_id.status': 1 } },
    ]);

    // Optional: Transform data to a more readable format
    const formatted = {};
    result.forEach((item) => {
      const date = item._id.date;
      const status = item._id.status;
      if (!formatted[date]) formatted[date] = { Booked: 0, Complete: 0 };
      formatted[date][status] = item.count;
    });

    return formatted;
  }
}
