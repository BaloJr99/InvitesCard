import { RoleActionEvent } from "./enum";

export interface IRole {
  id: string;
  name: string;
  isActive: boolean;
}

export interface IRoleAction {
  role: IRole | undefined;
  action: RoleActionEvent;
}