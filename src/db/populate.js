import fs from 'fs';
import path from 'path';
import db from "./dbConfig.js";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = fs.readFileSync(path.join(__dirname, 'populate.sql'), 'utf-8');

const statements = sql
  .split(";")
  .map(s => s.trim())
  .filter(s => s.length);

for (const statement of statements) {
  try {
    await db.raw(statement);
  } catch (err) {
    console.error("Erro executando:", statement);
    console.error(err.message);
  }
}

console.log("Database successfully created and populated!");
process.exit();
