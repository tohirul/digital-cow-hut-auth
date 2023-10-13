import mongoose, { Schema } from 'mongoose';
import { AdminModel, IAdmin, IAdminMethods } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const AdminSchema = new Schema<IAdmin, Record<string, unknown>, IAdminMethods>(
  { 
    phoneNumber: {
    type: String,
    required: true,
    unique: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
   
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

AdminSchema.methods.passwordMatch = async function (
  givenPassword: string,
  savedPassword: string,
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

AdminSchema.methods.findExistingById = async function (
  property: string,
): Promise<IAdmin|null> {
  const result = await Admin.findById({_id: property});
  return result;
};

AdminSchema.methods.findExistingByPhone = async function (
  property: string,
): Promise<IAdmin|null> {
  const result = await Admin.findOne({phoneNumber: property});
  return result;
};

AdminSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const Admin = mongoose.model<IAdmin, AdminModel>('Admin', AdminSchema);
export default Admin;
