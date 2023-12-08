import { Project } from "./index";

export interface Tag {
  tagId: string;
  title: string;
  priority: number;
  colour?: string | null;

  projectIds: string[];
  projects: Project[];
}
