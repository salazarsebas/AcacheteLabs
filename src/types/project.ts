export enum ProjectStatus {
  Active = "Active",
  InProgress = "In Progress",
  Experimental = "Experimental",
}

export enum ProjectLayer {
  Protocol = "Protocol",
  Application = "Application",
  Infrastructure = "Infrastructure",
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;
  liveUrl: string | null;
  status: ProjectStatus;
  layer: ProjectLayer;
  category: "public-goods" | "flagship" | "infrastructure";
  stack: string[];
  visualWeight: "standard" | "dominant" | "distinct";
}
