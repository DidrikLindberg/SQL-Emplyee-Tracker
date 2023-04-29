INSERT INTO Department (name)
VALUES ('Sales'),
        ('Marketing'),
        ('Finance'),
        ('Human Resources');

INSERT INTO Employee (first_name, last_name, role, manager_id)
VALUES ('John', 'Doe', 'Manager', NULL),
        ('Jane', 'Doe', 'Sales Associate', 1),
        ('Bob', 'Smith', 'Marketing Coordinator', 1),
        ('Mary', 'Johnson', 'Financial Analyst', 1),
        ('Mark', 'Lee', 'Human Resources Manager', 1),
        ('Sara', 'Chen', 'Accountant', 4),
        ('Tom', 'Wang', 'Recruiter', 5),
        ('Emily', 'Nguyen', 'Payroll Specialist', 5),
        ('David', 'Park', 'Sales Associate', 1),
        ('Amy', 'Kim', 'Marketing Coordinator', 2);

INSERT INTO Role (title, salary, department_id)
VALUES ('Manager', 100000, 1),
        ('Sales Associate', 50000, 1),
        ('Marketing Coordinator', 60000, 2),
        ('Financial Analyst', 80000, 3),
        ('Human Resources Manager', 90000, 4),
        ('Accountant', 75000, 3),
        ('Recruiter', 65000, 4),
        ('Payroll Specialist', 70000, 3);