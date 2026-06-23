import Database from "better-sqlite3";
import path from "path";

function checkDb(filePath: string) {
  console.log(`\nChecking: ${filePath}`);
  try {
    const db = new Database(filePath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables found:", tables.map((t: any) => t.name));
    for (const table of tables as any[]) {
      const count = db.prepare(`SELECT count(*) as cnt FROM [${table.name}]`).get() as any;
      console.log(`  - Table [${table.name}] has ${count.cnt} rows`);
    }
  } catch (err: any) {
    console.error(`Error opening database ${filePath}:`, err.message);
  }
}

checkDb(path.join(process.cwd(), "dev.db"));
checkDb(path.join(process.cwd(), "prisma", "dev.db"));
checkDb(path.join(process.cwd(), "employee.db"));
