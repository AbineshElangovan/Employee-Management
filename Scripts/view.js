const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("employee.db");

db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) {
        throw err;
    }

    console.table(rows);
    db.close();
});