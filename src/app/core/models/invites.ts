export interface IInvite {
  id: string,
  family: string,
  entriesNumber: number,
  confirmation: boolean | null,
  kidsAllowed: boolean,
  dateOfEvent: string,
  maxDateOfConfirmation: string,
  nameOfCelebrated: string,
  typeOfEvent: string,
  eventId: string
}