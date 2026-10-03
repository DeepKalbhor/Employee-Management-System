require("dotenv").config();

const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();

const PORT = process.env.PORT || 3000;

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// =========================
// MySQL Connection
// =========================

console.log("DB HOST:", process.env.DB_HOST);
console.log("DB PORT:", process.env.DB_PORT);
console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    ssl: {
        rejectUnauthorized: false
    }
});


// Test database connection

db.getConnection((err, connection) => {

    if (err) {

        console.log("MySQL connection failed:");
        console.log(err);

        return;
    }

    console.log("MySQL connected successfully");

    connection.release();
});


// =========================
// LOGIN
// =========================

app.post("/api/login", (req, res) => {

    const { employeeId, password } = req.body;

    if (employeeId === "EMP001" && password === "1234") {

        return res.json({
            success: true,
            message: "Login successful",
            employee_id: "EMP001",
            role: "Admin"
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid Employee ID or Password"
    });

});


// =========================
// GET ALL EMPLOYEES
// =========================

app.get("/api/employees", (req, res) => {

    const sql = `
        SELECT *
        FROM employees
        ORDER BY employee_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch employees"
            });
        }

        res.json({
            success: true,
            employees: results
        });

    });

});


// =========================
// SEARCH EMPLOYEES
// =========================

app.get("/api/employees/search", (req, res) => {

    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT *
        FROM employees
        WHERE employee_id LIKE ?
           OR name LIKE ?
           OR department LIKE ?
           OR designation LIKE ?
        ORDER BY employee_id
    `;

    db.query(
        sql,
        [search, search, search, search],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Search failed"
                });

            }

            res.json({
                success: true,
                employees: results
            });

        }
    );

});


// =========================
// ADD EMPLOYEE
// =========================

app.post("/api/employees", (req, res) => {

    const {
        employee_id,
        name,
        email,
        phone,
        address,
        department,
        designation,
        joining_date
    } = req.body;

    const sql = `
        INSERT INTO employees
        (
            employee_id,
            name,
            email,
            phone,
            address,
            department,
            designation,
            joining_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            name,
            email,
            phone,
            address,
            department,
            designation,
            joining_date
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(400).json({
                    success: false,
                    message: "Employee could not be added"
                });

            }

            res.json({
                success: true,
                message: "Employee added successfully"
            });

        }
    );

});


// =========================
// UPDATE EMPLOYEE
// =========================

app.put("/api/employees/:id", (req, res) => {

    const employeeId = req.params.id;

    const {
        name,
        email,
        phone,
        address,
        department,
        designation,
        joining_date
    } = req.body;

    const sql = `
        UPDATE employees
        SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?,
            department = ?,
            designation = ?,
            joining_date = ?
        WHERE employee_id = ?
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone,
            address,
            department,
            designation,
            joining_date,
            employeeId
        ],
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Employee update failed"
                });

            }

            res.json({
                success: true,
                message: "Employee updated successfully"
            });

        }
    );

});


// =========================
// DELETE / DEACTIVATE
// =========================

app.put("/api/employees/:id/deactivate", (req, res) => {

    const employeeId = req.params.id;

    const sql = `
        UPDATE employees
        SET status = 'Inactive'
        WHERE employee_id = ?
    `;

    db.query(sql, [employeeId], (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Unable to deactivate employee"
            });

        }

        res.json({
            success: true,
            message: "Employee deactivated"
        });

    });

});

// =========================
// ATTENDANCE
// =========================

// Get attendance
app.get("/api/attendance", (req, res) => {

    const sql = `
        SELECT
            a.attendance_id,
            a.employee_id,
            e.name,
            e.department,
            a.attendance_date,
            a.status,
            a.check_in,
            a.check_out
        FROM attendance a
        JOIN employees e
        ON a.employee_id = e.employee_id
        ORDER BY a.attendance_date DESC, a.attendance_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch attendance"
            });
        }

        res.json({
            success: true,
            attendance: results
        });

    });

});


// Search attendance
app.get("/api/attendance/search", (req, res) => {

    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT
            a.attendance_id,
            a.employee_id,
            e.name,
            e.department,
            a.attendance_date,
            a.status,
            a.check_in,
            a.check_out
        FROM attendance a
        JOIN employees e
        ON a.employee_id = e.employee_id
        WHERE a.employee_id LIKE ?
           OR e.name LIKE ?
           OR e.department LIKE ?
        ORDER BY a.attendance_date DESC
    `;

    db.query(
        sql,
        [search, search, search],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Attendance search failed"
                });

            }

            res.json({
                success: true,
                attendance: results
            });

        }
    );

});


// Mark attendance
app.post("/api/attendance", (req, res) => {

    const {
        employee_id,
        attendance_date,
        status,
        check_in,
        check_out
    } = req.body;

    const sql = `
        INSERT INTO attendance
        (
            employee_id,
            attendance_date,
            status,
            check_in,
            check_out
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            attendance_date,
            status,
            check_in || null,
            check_out || null
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(400).json({
                    success: false,
                    message: "Could not mark attendance"
                });

            }

            res.json({
                success: true,
                message: "Attendance marked successfully"
            });

        }
    );

});

// =========================
// LEAVE MANAGEMENT
// =========================

// Get all leave requests
app.get("/api/leaves", (req, res) => {

    const sql = `
        SELECT
            l.leave_id,
            l.employee_id,
            e.name,
            e.department,
            l.leave_type,
            l.start_date,
            l.end_date,
            l.days,
            l.reason,
            l.status,
            l.applied_date
        FROM leave_requests l
        JOIN employees e
        ON l.employee_id = e.employee_id
        ORDER BY l.leave_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch leave requests"
            });

        }

        res.json({
            success: true,
            leaves: results
        });

    });

});


// Search leave requests
app.get("/api/leaves/search", (req, res) => {

    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT
            l.leave_id,
            l.employee_id,
            e.name,
            e.department,
            l.leave_type,
            l.start_date,
            l.end_date,
            l.days,
            l.reason,
            l.status,
            l.applied_date
        FROM leave_requests l
        JOIN employees e
        ON l.employee_id = e.employee_id
        WHERE l.employee_id LIKE ?
           OR e.name LIKE ?
           OR l.leave_type LIKE ?
           OR l.status LIKE ?
        ORDER BY l.leave_id DESC
    `;

    db.query(
        sql,
        [search, search, search, search],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Leave search failed"
                });

            }

            res.json({
                success: true,
                leaves: results
            });

        }
    );

});


// Apply for leave
app.post("/api/leaves", (req, res) => {

    const {
        employee_id,
        leave_type,
        start_date,
        end_date,
        days,
        reason
    } = req.body;

    const sql = `
        INSERT INTO leave_requests
        (
            employee_id,
            leave_type,
            start_date,
            end_date,
            days,
            reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            leave_type,
            start_date,
            end_date,
            days,
            reason
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(400).json({
                    success: false,
                    message: "Leave request could not be submitted"
                });

            }

            res.json({
                success: true,
                message: "Leave request submitted"
            });

        }
    );

});


// Approve / Reject leave
app.put("/api/leaves/:id/status", (req, res) => {

    const leaveId = req.params.id;

    const { status } = req.body;

    if (
        status !== "Approved" &&
        status !== "Rejected"
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid leave status"
        });

    }

    const sql = `
        UPDATE leave_requests
        SET status = ?
        WHERE leave_id = ?
    `;

    db.query(
        sql,
        [status, leaveId],
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Unable to update leave status"
                });

            }

            res.json({
                success: true,
                message: `Leave ${status.toLowerCase()}`
            });

        }
    );

});

// =========================
// SALARY MANAGEMENT
// =========================

// Get salaries
app.get("/api/salaries", (req, res) => {

    const sql = `
        SELECT
            s.salary_id,
            s.employee_id,
            e.name,
            e.department,
            s.month,
            s.basic_salary,
            s.allowances,
            s.other_deductions,
            s.leave_deduction,
            s.net_salary
        FROM salaries s
        JOIN employees e
        ON s.employee_id = e.employee_id
        ORDER BY s.salary_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch salaries"
            });

        }

        // Calculate leave deduction
        results.forEach(salary => {

            salary.leave_deduction =
                Number(salary.leave_deduction || 0);

            salary.net_salary =
                Number(salary.basic_salary) +
                Number(salary.allowances || 0) -
                Number(salary.other_deductions || 0) -
                salary.leave_deduction;

        });

        res.json({
            success: true,
            salaries: results
        });

    });

});


// Search salaries
app.get("/api/salaries/search", (req, res) => {

    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT
            s.salary_id,
            s.employee_id,
            e.name,
            e.department,
            s.month,
            s.basic_salary,
            s.allowances,
            s.other_deductions,
            s.leave_deduction,
            s.net_salary
        FROM salaries s
        JOIN employees e
        ON s.employee_id = e.employee_id
        WHERE s.employee_id LIKE ?
           OR e.name LIKE ?
           OR s.month LIKE ?
        ORDER BY s.salary_id DESC
    `;

    db.query(
        sql,
        [search, search, search],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Salary search failed"
                });

            }

            results.forEach(salary => {

                salary.leave_deduction =
                    Number(salary.leave_deduction || 0);

                salary.net_salary =
                    Number(salary.basic_salary) +
                    Number(salary.allowances || 0) -
                    Number(salary.other_deductions || 0) -
                    salary.leave_deduction;

            });

            res.json({
                success: true,
                salaries: results
            });

        }
    );

});

// =========================
// PERFORMANCE MANAGEMENT
// =========================

// Get performance records
app.get("/api/performance", (req, res) => {

    const sql = `
        SELECT
            p.performance_id,
            p.employee_id,
            e.name,
            e.department,
            p.review_date,
            p.rating,
            p.comments
        FROM performance p
        JOIN employees e
        ON p.employee_id = e.employee_id
        ORDER BY p.review_date DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch performance records"
            });

        }

        res.json({
            success: true,
            performance: results
        });

    });

});


// Search performance
app.get("/api/performance/search", (req, res) => {

    const search = `%${req.query.q || ""}%`;

    const sql = `
        SELECT
            p.performance_id,
            p.employee_id,
            e.name,
            e.department,
            p.review_date,
            p.rating,
            p.comments
        FROM performance p
        JOIN employees e
        ON p.employee_id = e.employee_id
        WHERE p.employee_id LIKE ?
           OR e.name LIKE ?
           OR e.department LIKE ?
        ORDER BY p.review_date DESC
    `;

    db.query(
        sql,
        [search, search, search],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Performance search failed"
                });

            }

            res.json({
                success: true,
                performance: results
            });

        }
    );

});


// Add performance review
app.post("/api/performance", (req, res) => {

    const {
        employee_id,
        review_date,
        rating,
        comments
    } = req.body;

    const sql = `
        INSERT INTO performance
        (
            employee_id,
            review_date,
            rating,
            comments
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            review_date,
            rating,
            comments
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(400).json({
                    success: false,
                    message: "Performance review could not be added"
                });

            }

            res.json({
                success: true,
                message: "Performance review added successfully"
            });

        }
    );

});

// TASKS

app.get("/api/tasks", (req, res) => {
    db.query(`
        SELECT t.*, e.name
        FROM tasks t
        JOIN employees e
        ON t.employee_id = e.employee_id
        ORDER BY t.task_id DESC
    `, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post(
    "/api/tasks",
    authorize("Admin", "Manager"),
    (req, res) => {

    const { employee_id, title, due_date } = req.body;

    db.query(
        `INSERT INTO tasks
        (employee_id, title, due_date)
        VALUES (?, ?, ?)`,
        [employee_id, title, due_date],
        (err) => {

            if (err) return res.status(500).json(err);

            db.query(
                `INSERT INTO notifications
                (employee_id, message)
                VALUES (?, ?)`,
                [
                    employee_id,
                    `New task: ${title}`
                ]
            );

            res.json({
                success: true
            });
        }
    );
});

app.put("/api/tasks/:id", (req, res) => {

    db.query(
        `UPDATE tasks SET status=? WHERE task_id=?`,
        [req.body.status, req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({ success: true });
        }
    );
});


// NOTIFICATIONS

app.get("/api/notifications/:employeeId", (req, res) => {

    db.query(
        `SELECT * FROM notifications
         WHERE employee_id=?
         ORDER BY created_at DESC`,
        [req.params.employeeId],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result);
        }
    );
});

// REPORTS

app.get("/api/reports", (req, res) => {

    const queries = {

        employees:
            "SELECT COUNT(*) AS total FROM employees",

        attendance:
            "SELECT COUNT(*) AS total FROM attendance",

        leave:
            "SELECT COUNT(*) AS total FROM leave_requests",

        tasks:
            "SELECT COUNT(*) AS total FROM tasks"

    };

    const result = {};

    db.query(
        queries.employees,
        (err, employees) => {

            if (err) return res.status(500).json(err);

            result.employees = employees[0].total;

            db.query(
                queries.attendance,
                (err, attendance) => {

                    if (err)
                        return res.status(500).json(err);

                    result.attendance =
                        attendance[0].total;

                    db.query(
                        queries.leave,
                        (err, leave) => {

                            if (err)
                                return res.status(500).json(err);

                            result.leave =
                                leave[0].total;

                            db.query(
                                queries.tasks,
                                (err, tasks) => {

                                    if (err)
                                        return res.status(500).json(err);

                                    result.tasks =
                                        tasks[0].total;

                                    res.json(result);

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});

// PROFILE UPDATE

app.get("/api/profile/:id", (req, res) => {

    db.query(
        `SELECT employee_id, name, email, phone
         FROM employees
         WHERE employee_id = ?`,
        [req.params.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0)
                return res.status(404).json({
                    message: "Employee not found"
                });

            res.json(result[0]);
        }
    );
});


app.put("/api/profile/:id", (req, res) => {

    const {
        email,
        phone
    } = req.body;

    db.query(
        `UPDATE employees
         SET email = ?, phone = ?
         WHERE employee_id = ?`,
        [
            email,
            phone,
            req.params.id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true,
                message: "Profile updated"
            });
        }
    );
});

// ROLES

app.get("/api/roles", (req, res) => {

    db.query(
        `SELECT employee_id, name, email, role
         FROM employees
         ORDER BY employee_id`,
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);
        }
    );
});


app.put("/api/roles/:id", (req, res) => {

    db.query(
        `UPDATE employees
         SET role = ?
         WHERE employee_id = ?`,
        [
            req.body.role,
            req.params.id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true
            });
        }
    );
});

function authorize(...roles) {
    return (req, res, next) => {

        const role = req.headers.role;

        if (!roles.includes(role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
}

app.get("/api/dashboard-stats", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM employees) AS totalEmployees,

            (SELECT COUNT(*)
             FROM attendance
             WHERE status = 'Present') AS presentToday,

            (SELECT COUNT(*)
             FROM leave_requests
             WHERE status = 'Approved') AS onLeave,

            (SELECT COUNT(*)
             FROM leave_requests
             WHERE status = 'Pending') AS pendingRequests
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log("Dashboard error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not load dashboard statistics"
            });
        }

        res.json({
            success: true,
            ...result[0]
        });

    });

});

// =========================
// START SERVER
// =========================
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
