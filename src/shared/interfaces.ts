export interface IEntry {
  id: string,
  family: string,
  entriesNumber: number,
  entriesConfirmed: number,
  message?: string,
  confirmation: boolean,
  phoneNumber: string
}

export interface IEntryResolved {
  entry: IEntry[] | null;
  error?: string;
}