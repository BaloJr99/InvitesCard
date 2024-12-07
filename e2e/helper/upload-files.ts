import path from 'path';
import { fileURLToPath } from 'url';

export const uploadFilesPath = (fileName: string) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return path.join(__dirname, `../utility/${fileName}`);
};
