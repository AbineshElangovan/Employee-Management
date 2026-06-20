
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "employee.db");
const db = new Database(dbPath);

try {
  const info = db.pragma("table_info(employees)") as any[];

  if (info && info.length > 0) {
    const hasImageColumn = info.some(
      (col) => col.name === "Image"
    );

    const hasUpdatedAt = info.some(
      (col) => col.name === "updatedAt"
    );

    const hasCreatedAt = info.some(
      (col) => col.name === "createdAt"
    );

    if (
      hasImageColumn ||
      !hasUpdatedAt ||
      !hasCreatedAt
    ) {
      console.log(
        "Old schema detected in employees table. Dropping for recreation..."
      );

      db.exec("DROP TABLE IF EXISTS employees");
    }
  }
} catch (e) {
  console.error(e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    imageUrl TEXT,
    employeeId TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT,
    salary INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK(status IN ('active','inactive','on_leave')) DEFAULT 'active',
    attendancePercentage INTEGER DEFAULT 0,
    address TEXT NOT NULL,
    joiningDate TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;

