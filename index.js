// npm packages set as variables
const inquirer = require("inquirer");
const figlet = require("figlet");
// const chalk = require("chalk");
const cTable = require("console.table");




// ------------------------------------------
// require express and mysql2
const express = require('express');
const mysql = require('mysql2');

// PORT designation and app express
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db_connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
  },
        console.log(`Connected to the books_db database.`)
);

// ------------------------------------------





// modules set as variables
// const {db_connection} = require('./server.js');

// function that runs upon starting the file
db_connection.connect((err) => {
    if (err) throw err;
    console.log(`==============================================================================================`);
    console.log(`==============================================================================================`);
    
    console.log(``);
    // Creates title using Figlet package
    console.log(figlet.textSync("Employee Tracker", {
          font: "Star Wars",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 90,
          whitespaceBreak: false,
        })
    );
  
    console.log(`                                                                    ` + ("Created By:'Didrik Lindberg' "));
  
    console.log(``);
    console.log(`==============================================================================================`);
    console.log(`==============================================================================================`);
    console.log(``);
    // calls the initialQuery function that asks the user what they would like to do
    initialQuery();
  });

// initial question asks user what they would like to do
initialQuery = () => {
    inquirer.prompt([
        {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View department, roles or employee",
          "Add department, roles or employee",
          "Update employee role",
          "Remove employee",
          "Exit",
        ],
      },
      ])
      .then((answer) => {
        switch (answer.action) {
          case "View department, roles or employee":
            viewTable();
            break;
  
          case "Add department, roles or employee":
            addValue();
            break;
  
          case "Update employee role":
            updateRole();
            break;
  
          case "Remove employee":
              removeEmp();
              break;
  
          case "Exit":
            db_connection.end();
            break;
        }
      });
  }
  

  // function to view tables
    viewTable = () => {
        inquirer.prompt([
            {
            name: "table",
            type: "rawlist",
            message: "Which table would you like to view?",
            choices: [
                "Departments",
                "Roles",
                "Employee",
                "Back",
            ],
            },
        ])
        .then((answer) => {
            switch (answer.table) {
            case "Departments":
                viewDepartments();
                break;

            case "Roles":
                viewRoles();
                break;

            case "Employee":
                viewEmployees();

            case "Back":
                initialQuery();
                break;
            }
        });
    }

    // function to view departments
    viewDepartments = () => {
        db_connection.query("SELECT * FROM department;", (err, res) => {
            if (err) throw err;
            console.log(' ');
            console.log(`====================================================================================`);
            console.log(`All Departments:`);
            console.table(res);
            console.log(`====================================================================================`);
            console.log(' ');
            initialQuery();
        });
    }

    // function to view roles
    viewRoles = () => {
        db_connection.query("SELECT r.*, d.name AS Department_Name FROM role r JOIN department d ON r.department_id = d.id;", (err, res) => {
            if (err) throw err;
            console.log(`====================================================================================`);
            console.log(`All Roles:`);
            console.table(res);
            console.log(`====================================================================================`);
            initialQuery();
        });
    }

    // function to view employees
    viewEmployees = () => {
        db_connection.query("SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM Employee e INNER JOIN Role r ON e.role_id = r.id INNER JOIN Department d ON r.department_id = d.id LEFT JOIN Employee m ON e.manager_id = m.id ORDER BY e.id;", 
        (err, res) => {
            if (err) throw err;
            console.log(`====================================================================================`);
            console.log(`All Employees`);
            console.table(res);
            console.log(`====================================================================================`);
            initialQuery();
        });
    }


    // function to add values
    addValue = () => {
        inquirer.prompt([
            {
            name: "add",
            type: "rawlist",
            message: "Which table would you like to add to?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Back",
            ],
            },
        ])
        .then((answer) => {
            switch (answer.add) {
            case "Departments":
                addDepartment();
                break;

            case "Roles":
                addRole();
                break;

            case "Employees":
                addEmployee();
                break;

            case "Back":
                initialQuery();
                break;
            }
        });
    }

    // function to add department
    addDepartment = () => {
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you would like to add?",
            },
        ])
        .then((answer) => {
            db_connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Your department was added successfully!");
                    initialQuery();
                }
            );
        });
    }


    // function to add role
    addRole = () => {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the name of the role you would like to add?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the role you would like to add?",
            },
            {
                name: "department_id",
                type: "input",
                message: "What is the department ID of the role you would like to add?",
            },
        ])
        .then((answer) => {
            db_connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Your role was added successfully!");
                    initialQuery();
                }
            );
        });
    }

    // function to add employee
    addEmployee = () => {
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name of the employee you would like to add?",
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the last name of the employee you would like to add?",
            },
            {
                name: "id",
                type: "input",
                message: "What is the ID of the role you would like to add?",
            },
            {
                name: "manager_id",
                type: "input",
                message: "What is the manager ID of the employee you would like to add?",
            }
        ])
        .then((answer) => {
            db_connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.id,
                    manager_id: answer.manager_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Your employee was added successfully!");
                    initialQuery();
                }
            );
        });
    }



    // function to update employee role
    updateRole = () => {
        console.log("------------------------------------------------------------------------------------");
        console.log("------------------------------------------------------------------------------------");
        console.log("------------------------------------------------------------------------------------");
        console.log("------------------------------------------------------------------------------------");
        console.log("------------------------------------------------------------------------------------");
        //display all employees
        db_connection.query("SELECT * FROM employee", (err, res) => {
            if (err) throw err;
            console.table(res);
            
        });
        let listofEmployees = [];
        let lostofRoles = [];
        let empid = null;

        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the employee you would like to update?",
            },
        ])
        // search through db for employees with id
        // display

        .then((answer) => {
            empid = answer.id;
            //db query to get employee by id


            const query = `SELECT * FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id 
            WHERE employee.id = ?`;

            db_connection.query(query, [answer.id], (err, res) => {
                if (err) throw err;
                console.table(res);
                
            listofEmployees = res.map((employee) => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                };
            });
            //display all roles
            db_connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;

                listofRoles = res.map((role) => {
                    return {
                        name: role.title,
                        value: role.id,
                    };
                });
                inquirer.prompt([
                    {
                        name: "role",
                        type: "rawlist",
                        message: "What is the new role of the employee?",
                        choices: listofRoles,
                    },
                ])
                .then((answer) => {
                    db_connection.query(
                        "UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: answer.role,
                            },
                            {
                                id: empid,
                            },
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log("Your employee was updated successfully!");
                            initialQuery();
                        }
                        );
                    });
                });
            });
        });
    }
                
    removeEmp = () => {

        inquirer
        .prompt([
          {
            name: "empToRemove",
            type: "input",
            message:
              "What is the last name of the employee you would like to remove?",
          },
        ])
        .then((answer) => {
          const query = `SELECT employee.id AS Employee_ID, first_name, last_name, title, salary, department.name AS Department FROM employee 
          INNER JOIN role ON employee.role_Id = role.id
          INNER JOIN department ON role.department_id = department.id 
          WHERE ?`;
          db_connection.query(query, { last_name: answer.empToRemove }, (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
              console.log ("No employee found by that name");
              initialQuery();
            } else {
              console.log("Employee found")
              console.log(` `)
              console.log(`====================================================================================`);
              console.log(`Employee Information:`);
              console.table(res);
              console.log(`====================================================================================`);
              inquirer
                .prompt({
                name: "idConfirm",
                type: "number",
                message: "Please enter the employee's ID to confirm choice:",
                })
                .then((answer) => {
                  const query = "SELECT * FROM Employee WHERE ?";
                  db_connection.query(query, { id: answer.idConfirm }, (err, res) => {
                  if (err) throw err;
                  let idToDelete = answer.idConfirm;
                  const deleteQuery = `DELETE FROM employee WHERE id = ${idToDelete}`;
                  db_connection.query(deleteQuery, (err,res) => {
                    if (err) throw err;
                          
                    console.log(`====================================================================================`);
                    console.log(`Employee with ID #${idToDelete} has been removed.`);
                    console.log(`====================================================================================`);
                    
                    initialQuery();
                  })
                }
                );
                });
            }
        }
        );
        });
        
    }
