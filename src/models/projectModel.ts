import { Schema, Document, model } from 'mongoose';

export interface ProjectDocument extends Document {
  projectId: string;
  name: string;
  // other fields...
}

const projectSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  // other fields...
}, 
  { 
    collection: 'Project' 
  });

const Project = model<ProjectDocument>('Project', projectSchema);

export default Project;