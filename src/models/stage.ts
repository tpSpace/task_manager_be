import { Ticket, Project } from "./index";

export interface Stage {
  stageId: string;
  title: string;

  ticketIds: string[];
  tickets: Ticket[];

  projectIds: string[];
  projects: Project[];
}
