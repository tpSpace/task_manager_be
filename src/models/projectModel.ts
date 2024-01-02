import { Schema, Document, model, Types } from 'mongoose';

export interface ProjectDocument extends Document {
  projectId: string;
  title: string;
  adminId: string;
  userIds: string[];
}

const projectSchema = new Schema({
  projectId: { 
    type: Schema.Types.ObjectId, 
    unique: true,
    default: new Types.ObjectId() 
  },
  title: { 
    type: String, 
    required: true 
  },
  adminId:{
    type: String,
    required: true
  },
  userIds: [{
    type: String
  }]
}, 
  { 
    collection: 'Project' 
  });

const Project = model<ProjectDocument>('Project', projectSchema);

export default Project;