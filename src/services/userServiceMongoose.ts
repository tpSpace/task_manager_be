import User, { UserDocument } from '../models/userModel';

export const findUserByEmailMongoose = async (email: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ email }).exec();
  return user;
};

export const createUserMongoose = async (user: UserDocument): Promise<UserDocument> => {
  const newUser = await User.create(user);
  return newUser;
}

export const findUserbyUserIdMongoose = async (userId: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ userId: userId }).exec();
  return user;
};