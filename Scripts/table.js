const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("employee.db");

db.run(`
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    imageUrl TEXT,
    employeeId TEXT NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT,
    joiningDate TEXT NOT NULL,
    salary REAL NOT NULL DEFAULT 0,
    status TEXT CHECK(status IN ('active','inactive','on_leave')) DEFAULT 'active',
    attendancePercentage REAL DEFAULT 0,
    address TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Employees table created successfully with correct schema!");
    }

    db.close();
});
