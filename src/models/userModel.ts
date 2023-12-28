import { Schema, Document, model, Types } from 'mongoose';
import { ProjectDocument } from './projectModel'; // import the ProjectDocument interface

export interface UserDocument extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  projects: Types.Array<ProjectDocument['_id']>; // Add this line
}

const userSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    unique: true,
    default: new Types.ObjectId() 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String 
  },
  projects: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Project' 
  }], 
}, 
  { 
    collection: 'User' 
  });

const User = model<UserDocument>('User', userSchema);

export default User;