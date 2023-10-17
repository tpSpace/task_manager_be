import { User } from "./index"
export interface Comment{
  content: string;
  user: User;
  created_at: Date;
}