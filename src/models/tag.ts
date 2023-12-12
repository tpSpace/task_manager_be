import { Project } from '.';

export interface Tag {
  tagId: string;
  title: string;
  priority: number;
  colour?: string;

  projectIds: string[];
  projects: Project[];
}
