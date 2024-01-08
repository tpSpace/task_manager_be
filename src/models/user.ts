export interface User {
  userId: string;
  name: string;
  email: string;
  avatar?: string | null;
  password: string;

  projectIds: string[];
  comments: Comment[];
}
