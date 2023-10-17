import { User } from "./index";

export interface Project{
  id: number;
  title: string;
  members: User[];
  creator: User;
}