import User, { UserDocument } from '../models/userModel';

export const findUserByEmailMongoose = async (email: string): Promise<UserDocument | null> => {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    // Handle any errors (e.g., database connection issues, etc.)
    console.error('Error finding user by email:', error);
    throw error; // You may want to handle this differently based on your application's needs.
  }
};

export const createUserMongoose = async (user: UserDocument): Promise<UserDocument> => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (error) {
    // Handle any errors (e.g., database connection issues, etc.)
    console.error('Error creating user:', error);
    throw error; // You may want to handle this differently based on your application's needs.
  }
}