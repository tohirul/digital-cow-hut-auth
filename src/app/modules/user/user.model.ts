import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { UserRoles } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser, Record<string, unknown>, UserModel>(
  {
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRoles,
      required: true,
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
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: false,
      default: 0,
    },
    income: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.methods.passwordMatch = async function (
  givenPassword: string,
  savedPassword: string,
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.methods.findExistingById = async function (
  property: string,
): Promise<IUser|null> {
  const result = await User.findById({_id: property});
  return result;
};

UserSchema.methods.findExistingByPhone = async function (
  property: string,
): Promise<IUser|null> {
  const result = await User.findOne({phoneNumber: property});
  return result;
};

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const User = model<IUser, UserModel>('User', UserSchema);
export default User;
