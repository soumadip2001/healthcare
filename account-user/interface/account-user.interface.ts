// import { Document, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  //   roleId: Types.ObjectId;
  //   active: boolean;
  desciption?: string | null;
  //   createdAt?: Date;
  //   updatedAt?: Date;
}

export interface Ilogin {
  email: string;
  password: string;
}
