export interface IEntry {
  id: string,
  family: string,
  entriesNumber: number,
  message?: string,
  confirmation: boolean
}

export interface IEntryResolved {
  entry: IEntry[] | null;
  error?: string;
}