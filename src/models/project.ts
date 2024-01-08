export interface Project {
  projectId: string;
  adminId: string;
  title: string;
  history: string[];

  userIds: string[];
  tagIds: string[];
  stageIds: string[];
}
