-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT,
    "position" TEXT,
    "designation" TEXT,
    "salary" REAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "attendancePercentage" REAL DEFAULT 0,
    "address" TEXT,
    "joiningDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("address", "attendancePercentage", "createdAt", "department", "designation", "email", "employeeId", "firstName", "id", "imageUrl", "joiningDate", "lastName", "phone", "position", "salary", "status", "updatedAt") SELECT "address", "attendancePercentage", "createdAt", "department", "designation", "email", "employeeId", "firstName", "id", "imageUrl", "joiningDate", "lastName", "phone", "position", "salary", "status", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
