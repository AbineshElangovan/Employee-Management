const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("employee.db");

db.run(`
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    Image TEXT NOT NULL,
    employeeId TEXT NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    joiningDate TEXT NOT NULL,
    salary REAL NOT NULL,
    status TEXT NOT NULL,
    attendancePercentage REAL NOT NULL,
    address TEXT NOT NULL
)
`, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Employees table created successfully!");
    }

    db.close();
});
