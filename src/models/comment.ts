import { User } from "./index";
export interface Comment {
  id: string;
  userId: string;
  dateCreated: Date;
  isDeleted: boolean;
}
