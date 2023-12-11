import { User, Tag, Stage } from ".";

export interface Project {
  projectId: string;
  adminId: string;
  title: string;
  history: string[];

  userIds: string[];
  users: User[];

  tagIds: string[];
  tags: Tag[];

  stageIds: string[];
  stages: Stage[];
}
