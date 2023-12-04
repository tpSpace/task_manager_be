import { User } from "./index";

export interface Project {
  id: string;
  adminId: string;
  userId: string[];
  tagId: string[];
  stageId: string[];
  title: string;
  history: string[];
}
