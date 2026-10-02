ALTER USER 'employee'@'localhost'
IDENTIFIED BY 'employee123';

FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON employee_management.*
TO 'employee'@'localhost';

FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS employee_management;

USE employee_management;

CREATE TABLE employees (
    employee_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

INSERT INTO employees
(employee_id, name, email, phone, address, department, designation, joining_date, status)
VALUES
('EMP001', 'Deep Kalbhor', 'deep@example.com', '9876543210',
 'Bhavnagar', 'IT', 'Software Developer', '2025-07-01', 'Active'),

('EMP002', 'Rahul Sharma', 'rahul@example.com', '9876543211',
 'Mumbai', 'HR', 'HR Executive', '2024-06-15', 'Active'),

('EMP003', 'Priya Patil', 'priya@example.com', '9876543212',
 'Pune', 'Finance', 'Accountant', '2024-08-20', 'Active'),

('EMP004', 'Amit Shah', 'amit@example.com', '9876543213',
 'Ahmedabad', 'Marketing', 'Marketing Executive', '2025-01-10', 'Active');

 USE employee_management;

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave') NOT NULL,
    check_in TIME,
    check_out TIME,
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);

INSERT INTO attendance
(employee_id, attendance_date, status, check_in, check_out)
VALUES
('EMP001', CURDATE(), 'Present', '09:00:00', '17:30:00'),
('EMP002', CURDATE(), 'Present', '09:15:00', '17:15:00'),
('EMP003', CURDATE(), 'Leave', NULL, NULL);

USE employee_management;

CREATE TABLE IF NOT EXISTS leave_requests (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT NOT NULL,
    reason VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);

INSERT INTO leave_requests
(employee_id, leave_type, start_date, end_date, days, reason, status)
VALUES
('EMP001', 'Casual Leave', '2026-10-05', '2026-10-06', 2,
 'Personal work', 'Pending'),

('EMP002', 'Sick Leave', '2026-09-28', '2026-09-29', 2,
 'Not feeling well', 'Approved'),

('EMP003', 'Casual Leave', '2026-10-10', '2026-10-12', 3,
 'Family function', 'Pending');

 USE employee_management;

CREATE TABLE IF NOT EXISTS salaries (
    salary_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    month VARCHAR(20) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    leave_deduction DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);

INSERT INTO salaries
(employee_id, month, basic_salary, allowances, other_deductions)
VALUES
('EMP001', 'October 2026', 50000, 5000, 1000),
('EMP002', 'October 2026', 40000, 4000, 500),
('EMP003', 'October 2026', 45000, 4500, 750),
('EMP004', 'October 2026', 42000, 4000, 500);


USE employee_management;

CREATE TABLE IF NOT EXISTS performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    review_date DATE NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    comments VARCHAR(500),
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);

INSERT INTO performance
(employee_id, review_date, rating, comments)
VALUES
('EMP001', '2026-09-30', 4.5, 'Excellent technical performance'),
('EMP002', '2026-09-30', 4.0, 'Good HR management skills'),
('EMP003', '2026-09-30', 3.5, 'Good performance, needs improvement in reporting'),
('EMP004', '2026-09-30', 4.2, 'Strong marketing and communication skills');

CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    title VARCHAR(150),
    due_date DATE,
    status VARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    message VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);

ALTER TABLE employees
ADD COLUMN role VARCHAR(20) DEFAULT 'Employee';

UPDATE employees
SET role = 'Admin'
WHERE employee_id = 'EMP001';

UPDATE employees
SET role = 'HR'
WHERE employee_id = 'EMP002';

UPDATE employees
SET role = 'Manager'
WHERE employee_id = 'EMP003';