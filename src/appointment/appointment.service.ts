import { HttpException, Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { AccountUserRepository } from 'src/account-user/account-user.repository';
import { AppointmentStatus, Rolename } from 'src/config/enum.config';
import { Cron } from '@nestjs/schedule';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly accountUserRepository: AccountUserRepository,
    private readonly gateway: WebsocketsGateway,
  ) {}

  @Cron('0 8 * * *')
  async create() {
    const slotStartTime = '09:00';
    const slotEndTime = '10:00';
    const slotDuration = 30; // in minutes
    try {
      //  Fetch list of doctors
      const listOfAllDoctors = await this.getListofAllDoctors(); // should return array of doctorIds

      // Convert start/end time to minutes
      const startMins = this.timeToMinutes(slotStartTime);
      const endMins = this.timeToMinutes(slotEndTime);

      // Loop through each doctor
      if (listOfAllDoctors && listOfAllDoctors.length > 0) {
        for (const doctorid of listOfAllDoctors) {
          let currentStart = startMins;

          while (currentStart + slotDuration <= endMins) {
            const currentEnd = currentStart + slotDuration;

            const today = new Date();
            const dateOnlyString = today.toISOString().slice(0, 10);
            const timeinStr = this.minutesToTime(currentStart);
            const timeednStr = this.minutesToTime(currentEnd);
            // Insert appointment slot for this doctor
            const appointmentInfo = {
              patientid: null,
              doctorid: doctorid._id.toString(),
              appointmentdate: dateOnlyString,
              starttime: timeinStr, // e.g., "09:00"
              endtime: timeednStr, // e.g., "09:30"
              status: AppointmentStatus.Available,
              reason: '',
              prescription: null,
              isdeleted: false,
            };
            await this.appointmentRepository.createAppointment(appointmentInfo);

            // Move to next slot
            currentStart = currentEnd;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async getListofAllDoctors() {
    try {
      const getDoctorRoleInfo = await this.appointmentRepository.getRoleInfo(
        Rolename.Doctor,
      );
      const doctorRoleid =
        getDoctorRoleInfo.length > 0
          ? getDoctorRoleInfo[0]?._id.toString()
          : null;
      const getListofDoctor =
        await this.appointmentRepository.getListOfuserByroleid(doctorRoleid);
      return getListofDoctor;
    } catch (err) {
      throw err;
    }
  }

  async findAppointmentListBYDoctor(doctorid: string) {
    try {
      const isDoctorExists =
        await this.accountUserRepository.findUserByid(doctorid);
      if (!isDoctorExists) throw new HttpException('Doctor not found', 404);
      const appointmentListofADoctor =
        await this.appointmentRepository.getAppointmentListByDoctorId(doctorid);
      return appointmentListofADoctor;
    } catch (err) {
      throw err;
    }
  }

  async update(appointmentid: string, patientid: string) {
    try {
      // check is appointment exists and check if present its already booked or not
      const getappointByid =
        await this.appointmentRepository.getappointByid(appointmentid);
      if (!getappointByid) throw new HttpException('AppointmentNot found', 404);
      if (getappointByid.status == AppointmentStatus.Booked)
        throw new HttpException('Appointment already booked', 422);
      const appInfo =
        await this.appointmentRepository.getandUpdateAppointInfoById(
          appointmentid,
          patientid,
          AppointmentStatus.Booked,
        );
        const status = AppointmentStatus.Booked;
      if (patientid) {
        this.gateway.notifyPatient(patientid, {
          appointmentid,
          status,
        });
      }

      // Notify doctor
      if (getappointByid.doctorid) {
        this.gateway.notifyDoctor(getappointByid.doctorid, {
          appointmentid,
          status,
        });
      }

      return appInfo;
    } catch (err) {
      throw err;
    }
  }

  async updateByAdmin(
    appointmentid: string,
    patientid: string,
    appointmentStatus: any,
  ) {
    try {
      // check is appointment exists and check if present its already booked or not
      const getappointByid =
        await this.appointmentRepository.getappointByid(appointmentid);
      if (!getappointByid) throw new HttpException('AppointmentNot found', 404);
      const appInfo =
        await this.appointmentRepository.getandUpdateAppointInfoById(
          appointmentid,
          patientid,
          appointmentStatus,
        );
      return appInfo;
    } catch (err) {
      throw err;
    }
  }

  async updateByDoctor(appointmentid: string, prescriptionInfo: string | null) {
    try {
      // check is appointment exists and check if present its already booked or not
      const getappointByid =
        await this.appointmentRepository.getappointByid(appointmentid);
      if (!getappointByid) throw new HttpException('AppointmentNot found', 404);
      const appInfo =
        await this.appointmentRepository.getandUpdateAppointPrescriptionInfoById(
          appointmentid,
          prescriptionInfo,
        );
      return appInfo;
    } catch (err) {
      throw err;
    }
  }

  async getstausInfoByDoctor(doctorid: string, givendate: string) {
    try {
      const getbookingInfo =
        await this.appointmentRepository.getBookingInfoByDateAndDoctor(
          doctorid,
          givendate,
          AppointmentStatus.Booked,
        );
      return getbookingInfo;
    } catch (err) {
      throw err;
    }
  }

  async getAnnalytics(startdate: string, enddate: string) {
    try {
      const getAnalyticalReport =
        await this.appointmentRepository.getAppointmentsPerDayByStatus(
          null,
          null,
        );
      return getAnalyticalReport;
    } catch (err) {
      throw err;
    }
  }

  // Convert "HH:mm" to minutes
  timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  // Convert minutes back to "HH:mm"
  minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

    async updateRoleByAdmin(userid: string, rolename: string) {
    try {
      const roleInfo = await this.accountUserRepository.findByRoleInfoByName(AppointmentStatus[rolename]);
      const roleid = roleInfo.length > 0 ? roleInfo[0]._id.toString() : null;
      const userInfo = await this.accountUserRepository.getandUpdateAppointInfoById(userid, roleid);
      return userInfo;
    } catch (err) {
      throw err;
    }
  }
  async getAllrole() {
    try {
      const roleInfo = await this.accountUserRepository.getAllrole();
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }
}
