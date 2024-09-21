import { writeFile } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "src/.env.development" });

const successColor = "\x1b[32m%s\x1b[0m";
const checkSign = "\u{2705}";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const envFile = `export const environment = {
  production: ${process.env.production},
  apiUrl: '${process.env.apiUrl}',
  url: '${process.env.url}'
};`;

const targetPath = join(
  __dirname,
  "./src/environments/environment.development.ts"
);

writeFile(targetPath, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(
      successColor,
      `${checkSign} Successfully generated environment.development.ts`
    );
  }
});
