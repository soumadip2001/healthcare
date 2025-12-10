import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/account-user.schema';
import { Model } from 'mongoose';
import { IUser } from './interface/account-user.interface';
import { Roles } from 'src/common/schema/roles.schema';

@Injectable()
export class AccountUserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Roles.name) private readonly rolesModel: Model<Roles>,
  ) {}
  async findUserWithEmail(email: string | null) {
    try {
      const userInfo = await this.userModel.findOne({ email }).lean();
      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async adduser(user: IUser, roleid: string | null) {
    try {
      const newUser = new this.userModel({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        roleId: roleid,
        active: true,
      });
      const savedUser = await newUser.save();
      return savedUser.populate('_id', '');
    } catch (err) {
      throw err;
    }
  }

  async getdefaultRoles() {
    try {
      const defaultRole = await this.rolesModel
        .find({ isdefault: true })
        .populate('_id', 'name isdefault')
        .lean();
      return defaultRole;
    } catch (err) {
      throw err;
    }
  }

  async findUserByid(id: string) {
    try {
      const userInfo = await this.userModel.findById(id).lean();
      return userInfo;
    } catch (err) {
      throw err;
    }
  }

  async findByRoleid(roleid: string) {
    try {
      const roleInfo = await this.rolesModel.findById(roleid).lean();
      return roleInfo;
    } catch (err) {
      throw err;
    }
  }

  async findByRoleInfoByName(rolename: string) {
    try {
      const roleInfo = await this.rolesModel.find({ name: rolename }).lean();
      return roleInfo;
    } catch (err) {
      throw err;
    }
  }
  async getandUpdateAppointInfoById(userid: string, roleid: string | null) {
    try {
      const updateUser = await this.userModel
        .findByIdAndUpdate(
          userid, // find by _id only
          { roleId: roleid },
          { new: true }, // return the updated document
        )
        .lean();

      return updateUser;
    } catch (err) {
      throw err;
    }
  }

  async getAllrole() {
    try {
      const roleInfo = await this.rolesModel.find().lean();
      return roleInfo;
    } catch (err) {
      throw err;
    }
  }
}
