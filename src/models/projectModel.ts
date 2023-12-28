import { Schema, Document, model, Types } from 'mongoose';

export interface ProjectDocument extends Document {
  projectId: string;
  title: string;
  adminId: string;
  memberIds: string[];
  // other fields...
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
  memberIds: [{
    type: String
  }]
}, 
  { 
    collection: 'Project' 
  });

const Project = model<ProjectDocument>('Project', projectSchema);

export default Project;