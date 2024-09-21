export interface IFamilyGroupAction {
  familyGroup: IFamilyGroup;
  isNew: boolean;
}

export interface IFamilyGroup {
  id: string;
  familyGroup: string;
  eventId: string;
}
