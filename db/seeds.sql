INSERT INTO Department (name)
VALUES ('Sales'),
        ('Marketing'),
        ('Finance'),
        ('Human Resources');

INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
        ('Jane', 'Doe', 2, 1),
        ('Bob', 'Smith', 3, 1),
        ('Mary', 'Johnson', 4, 1),
        ('Mark', 'Lee', 5, 1),
        ('Sara', 'Chen', 6, 4),
        ('Tom', 'Wang', 7, 5),
        ('Emily', 'Nguyen', 8, 5),
        ('David', 'Park', 9, 1),
        ('Amy', 'Kim', 10, 2);

INSERT INTO Role (title, salary, department_id)
VALUES ('Manager', 100000, 1),
        ('Sales Associate', 50000, 1),
        ('Marketing Coordinator', 60000, 2),
        ('Financial Analyst', 80000, 3),
        ('Human Resources Manager', 90000, 4),
        ('Accountant', 75000, 3),
        ('Recruiter', 65000, 4),
        ('Payroll Specialist', 70000, 3);