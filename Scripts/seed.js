const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("employee.db");

db.serialize(() => {
  db.run("DELETE FROM employees");

  db.run(`
    INSERT INTO employees (
      id, imageUrl, employeeId, firstName, lastName, email, phone,
      department, designation, joiningDate, salary, status,
      attendancePercentage, address, createdAt, updatedAt
    ) VALUES
    ('1','https://randomuser.me/api/portraits/men/1.jpg','EMP001','Abinesh','Elangovan','abinesh@example.com','9876543210','Cyber Security','SOC Analyst','2025-01-15',45000,'active',95,'Karur, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2','https://randomuser.me/api/portraits/men/2.jpg','EMP002','Arun','Kumar','arun@example.com','9876543211','IT','Developer','2024-03-10',40000,'active',92,'Chennai, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3','https://randomuser.me/api/portraits/men/3.jpg','EMP003','Vignesh','Raj','vignesh@example.com','9876543212','HR','HR Executive','2023-07-22',35000,'active',88,'Coimbatore, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4','https://randomuser.me/api/portraits/men/4.jpg','EMP004','Karthik','M','karthik@example.com','9876543213','Finance','Accountant','2024-01-12',42000,'active',90,'Madurai, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('5','https://randomuser.me/api/portraits/men/5.jpg','EMP005','Praveen','S','praveen@example.com','9876543214','Cyber Security','Security Analyst','2024-05-18',50000,'inactive',85,'Salem, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('6','https://randomuser.me/api/portraits/men/6.jpg','EMP006','Rahul','K','rahul@example.com','9876543215','IT','Frontend Developer','2023-09-14',48000,'active',94,'Erode, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('7','https://randomuser.me/api/portraits/men/7.jpg','EMP007','Suresh','B','suresh@example.com','9876543216','Marketing','Marketing Executive','2024-02-20',38000,'active',87,'Trichy, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('8','https://randomuser.me/api/portraits/men/8.jpg','EMP008','Dinesh','R','dinesh@example.com','9876543217','Sales','Sales Executive','2024-06-01',36000,'active',91,'Namakkal, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('9','https://randomuser.me/api/portraits/men/9.jpg','EMP009','Ajith','P','ajith@example.com','9876543218','Finance','Financial Analyst','2023-11-05',52000,'active',89,'Tiruppur, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('10','https://randomuser.me/api/portraits/men/10.jpg','EMP010','Hari','V','hari@example.com','9876543219','Cyber Security','Incident Responder','2024-04-25',55000,'active',97,'Karur, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11','https://randomuser.me/api/portraits/men/11.jpg','EMP011','Mohan','T','mohan@example.com','9876543220','IT','Backend Developer','2023-08-16',47000,'active',93,'Chennai, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('12','https://randomuser.me/api/portraits/men/12.jpg','EMP012','Ramesh','N','ramesh@example.com','9876543221','HR','Recruiter','2024-07-11',39000,'inactive',82,'Coimbatore, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('13','https://randomuser.me/api/portraits/men/13.jpg','EMP013','Kishore','L','kishore@example.com','9876543222','Marketing','SEO Specialist','2024-01-05',41000,'active',90,'Madurai, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('14','https://randomuser.me/api/portraits/men/14.jpg','EMP014','Manoj','C','manoj@example.com','9876543223','Sales','Sales Manager','2023-05-30',58000,'active',95,'Salem, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('15','https://randomuser.me/api/portraits/men/15.jpg','EMP015','Santhosh','G','santhosh@example.com','9876543224','Finance','Auditor','2024-03-18',53000,'active',88,'Erode, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('16','https://randomuser.me/api/portraits/men/16.jpg','EMP016','Naveen','D','naveen@example.com','9876543225','Cyber Security','Penetration Tester','2024-08-09',60000,'active',96,'Trichy, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('17','https://randomuser.me/api/portraits/men/17.jpg','EMP017','Bala','J','bala@example.com','9876543226','IT','Full Stack Developer','2023-12-21',57000,'active',94,'Namakkal, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('18','https://randomuser.me/api/portraits/men/18.jpg','EMP018','Saravanan','A','saravanan@example.com','9876543227','HR','HR Manager','2023-06-15',54000,'active',89,'Tiruppur, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('19','https://randomuser.me/api/portraits/men/19.jpg','EMP019','Vinoth','E','vinoth@example.com','9876543228','Marketing','Content Strategist','2024-02-14',43000,'active',86,'Karur, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20','https://randomuser.me/api/portraits/men/20.jpg','EMP020','Gokul','F','gokul@example.com','9876543229','Sales','Business Development Executive','2024-09-01',46000,'active',92,'Chennai, Tamil Nadu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, (err) => {
    if (err) {
      console.error("Error inserting employees:", err);
    } else {
      console.log("20 Employees inserted successfully with correct schema!");
    }

    db.close();
  });
});