import Project, { ProjectDocument } from '../models/projectModel';

export const createProjectMongoose = async (project: ProjectDocument): Promise<ProjectDocument> => {
  const newProject = await Project.create(project);
  return newProject;
}