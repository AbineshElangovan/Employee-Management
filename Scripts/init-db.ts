// // import  db from "@/lib/db"

// async function init() {
//   const db = await openDb();

//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS employees (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       firstName TEXT NOT NULL,
//       lastName TEXT NOT NULL,
//       email TEXT UNIQUE,
//       department TEXT,
//       designation TEXT,
//       salary INTEGER,
//       status TEXT DEFAULT 'Active'
//     )
//   `);

//   console.log("Database initialized!");
// }

// init();