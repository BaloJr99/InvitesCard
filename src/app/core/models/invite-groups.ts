export interface IInviteGroupsAction {
  inviteGroup: IInviteGroups;
  isNew: boolean;
}

export interface IInviteGroups {
  id: string;
  inviteGroup: string;
  eventId: string;
}
