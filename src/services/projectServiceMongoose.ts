import Project, { ProjectDocument } from '../models/projectModel';

export const createProjectMongoose = async (project: ProjectDocument): Promise<ProjectDocument> => {
  const newProject = await Project.create(project);
  return newProject;
};

export const findProjectByIdMongoose = async (projectId: string): Promise<ProjectDocument | null> => {
  const project = await Project.findById(projectId);
  return project;
};

export const addMemberMongoose = async (projectId: string, userId: string): Promise<ProjectDocument | null> => {
  const project = await Project.findByIdAndUpdate(projectId, {
    $addToSet: { userIds: userId },
  }, { new: true });
  return project;
};