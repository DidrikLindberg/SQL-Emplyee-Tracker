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
  
          case "View department budgets":
              viewBudget();
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
                








    // // function to update department
    // updateDepartment = () => {
    //     inquirer.prompt([
    //         {
    //             name: "department",
    //             type: "input",
    //             message: "What is the name of the department you would like to update?",
    //         },
    //         {
    //             name: "id",
    //             type: "input",
    //             message: "What is the ID of the department you would like to update?",
    //         },
    //     ])
    //     .then((answer) => {
    //         db_connection.query(
    //             "UPDATE department SET ? WHERE ?",
    //                 {
    //                     name: answer.department,
    //                     id: answer.id,
    //                 },
    //             (err) => {
    //                 if (err) throw err;
    //                 console.log("Your department was updated successfully!");
    //                 initialQuery();
    //             }
    //         );
    //     });
    // }

    // // function to update employee role
    // updateRole = () => {
    //     db_connection.query("SELECT * FROM employee", (err, res) => {
    //         if (err) throw err;
    //         console.table(res);
    //     });
    //     inquirer.prompt([
    //         {
    //             name: "id",
    //             type: "input",
    //             message: "What is the ID of the role you would like to update?",
    //         },
    //     ])
    //     .then((answer) => {

    //         employeeID = answer.id;
    //         // db query to find all employees by user inputted ID
    //         // then puts part of the response into an array for subsequent inquirer question
    //         // then displays info to the user in table
    //         const query = `SELECT employee.id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, department.name AS Department FROM employee
    //         INNER JOIN role ON employee.role_Id = role.role_id
    //         INNER JOIN department ON role.dept_id = department.dept_id 
    //         WHERE ?`;
    //         //
    //         db_connection.query(query, { id: answer.id }, (err, res) => {
    //             if (err) throw err;
        
    //             console.log(` `)
    //             console.log(`====================================================================================`);
    //             console.table(res);
    //             console.log(`====================================================================================`);
    //             console.log(` `);
        
    //             listOfEmployee = res.map(employee => (
    //               {
    //                 name: employee.First_Name,
    //                 value: employee.Employee_ID
    //               }
    //             ));
        
    //             // db query to find all roles and then put them into an array for a subsequent inquirer question
    //             db_connection.query("SELECT * FROM roles", (err, res) => {
    //               if (err) throw err;
        
    //               listOfRoles = res.map(role => (
    //                 {
    //                   name: role.title,
    //                   value: role.role_id
    //                 }
    //               ))
        
    //               inquirer.prompt([
    //                 {
    //                   type: "list",
    //                   name: "nameConfirm",
    //                   message: "Please select the employee to confirm",
    //                   choices: listOfEmployee
    //                 },
    //                 {
    //                   type: "list",
    //                   name: "roleChoice",
    //                   message: "Please select a new role for the employee",
    //                   choices: listOfRoles
    //                 }
    //               ])
    //               .then((answers) => {
        
    //                 const query = `UPDATE employee SET role_id = ${answers.roleChoice} WHERE emp_id = ${answers.nameConfirm}`;
    //                 db_connection.query(query, (err, res) => {
    //                     if (err) throw err;
    //                 });
    //               })
    //                 .then(() => {
    //                   const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employee 
    //                     INNER JOIN roles ON employee.role_Id = roles.role_id
    //                     INNER JOIN departments ON roles.dept_id = departments.dept_id 
    //                     WHERE ?`;
    //                   db_connection.query(query, {last_name: employeeLastName }, (err,res) => {
    //                     if (err) throw err;
    //                     console.log(` `);
    //                     console.log(`====================================================================================`);
    //                     console.table(res);
    //                     console.log(`====================================================================================`);
    //                     console.log(` `);
    //                     initialQuery();
    //                   })
    //                 });
    //             });
    //           });        
    //         });
            
    //     }

    // // function to update employee
    // updateEmployee = () => {
    //     inquirer.prompt([
    //         {
    //             name: "first_name",
    //             type: "input",
    //             message: "What is the first name of the employee you would like to update?",
    //         },
    //         {
    //             name: "last_name",
    //             type: "input",
    //             message: "What is the last name of the employee you would like to update?",
    //         },
    //         {
    //             name: "role_id",
    //             type: "input",
    //             message: "What is the role ID of the employee you would like to update?",
    //         },
    //         {
    //             name: "manager_id",
    //             type: "input",
    //             message: "What is the manager ID of the employee you would like to update?",
    //         },
    //         {
    //             name: "id",
    //             type: "input",
    //             message: "What is the ID of the employee you would like to update?",
    //         },
    //     ])
    //     .then((answer) => {
    //         db_connection.query(
    //             "UPDATE employee SET ? WHERE ?",
    //                 {
    //                     first_name: answer.first_name,
    //                     last_name: answer.last_name,
    //                     role_id: answer.role_id,
    //                     manager_id: answer.manager_id,
    //                     id: answer.id,
    //                 },
    //             (err) => {
    //                 if (err) throw err;
    //                 console.log("Your employee was updated successfully!");
    //                 initialQuery();
    //             }
    //         );
    //     });
    // }

    // // function to delete values
    // deleteValue = () => {
    //     inquirer.prompt([
    //         {
    //         name: "delete",
    //         type: "rawlist",
    //         message: "Which table would you like to delete from?",
    //         choices: [
    //             "Departments",
    //             "Roles",
    //             "Employee",
    //             "Back",
    //         ],
    //         },
    //     ])
    //     .then((answer) => {
    //         switch (answer.delete) {
    //         case "Departments":
    //             deleteDepartment();
    //             break;

    //         case "Roles":
    //             deleteRole();
    //             break;

    //         case "Employee":
    //             deleteEmployee();
    //             break;

    //         case "Back":
    //             initialQuery();
    //             break;
    //         }
    //     });
    // }

    // // function to delete department
    // deleteDepartment = () => {
    //     inquirer.prompt([
    //         {
    //             name: "department",
    //             type: "input",
    //             message: "What is the name of the department you would like to delete?",
    //         },
    //     ])
    //     .then((answer) => {
    //         db_connection.query( 
    //             "DELETE FROM department WHERE ?",
    //                 {
    //                     name: answer.department,
    //                 },
    //             (err) => {
    //                 if (err) throw err;
    //                 console.log("Your department was deleted successfully!");
    //                 initialQuery();
    //             }
    //         );
    //     });
    // }

    // // function to delete role
    // deleteRole = () => {
    //     inquirer.prompt([
    //         {
    //             name: "title",
    //             type: "input",
    //             message: "What is the name of the role you would like to delete?",
    //         },
    //     ])
    //     .then((answer) => {
    //         db_connection.query(
    //             "DELETE FROM role WHERE ?",
    //                 {
    //                     title: answer.title,
    //                 },
    //             (err) => {
    //                 if (err) throw err;
    //                 console.log("Your role was deleted successfully!");
    //                 initialQuery();
    //             }
    //         );
    //     });
    // }

    // // function to delete employee
    // deleteEmployee = () => {
    //     inquirer.prompt([
    //         {
    //             name: "first_name",
    //             type: "input",
    //             message: "What is the first name of the employee you would like to delete?",
    //         },
    //         {
    //             name: "last_name",
    //             type: "input",
    //             message: "What is the last name of the employee you would like to delete?",
    //         },
    //         {
    //             name: "id",
    //             type: "input",
    //             message: "What is the ID of the employee you would like to delete?",
    //         },
    //     ])
    //     .then((answer) => {
    //         db_connection.query(
    //             "DELETE FROM employee WHERE ?",
    //                 {
    //                     first_name: answer.first_name,
    //                     last_name: answer.last_name,
    //                     id: answer.id,
    //                 },
    //             (err) => {
    //                 if (err) throw err;
    //                 console.log("Your employee was deleted successfully!");
    //                 initialQuery();
    //             }
    //         );
    //     });
    // }




















































// function to start the app
// function startApp() {
//     // console log the figlet npm package
//     console.log(
//         chalk.green(
//             figlet.textSync("Employee Tracker", {
//                 font: "big",
//                 horizontalLayout: "default",
//                 verticalLayout: "default",
//                 width: 80,
//                 whitespaceBreak: true
//             })
//         )
//     );
//     // call the main menu function
//     mainMenu();
// }



// // function to display the main menu
// function mainMenu() {
//     // inquirer prompt to select a choice from the main menu
//     inquirer.prompt([
//         {
//             type: "list",
//             name: "mainMenuChoice",
//             message: "What would you like to do?",
//             choices: [
//                 "View All Employees",
//                 "View All Employees By Department",
//                 "View All Employees By Manager",
//                 "Add Employee",
//                 "Remove Employee",
//                 "Update Employee Role",
//                 "Update Employee Manager",
//                 "View All Roles",
//                 "Add Role",
//                 "Remove Role",
//                 "View All Departments",
//                 "Add Department",
//                 "Remove Department",
//                 "Quit"
//             ]
//         }
//     ]).then(function (answer) {
//         // switch statement to call the function based on the answer
//         switch (answer.mainMenuChoice) {
//             case "View All Employees":
//                 viewAllEmployees();
//                 break;
//             case "View All Employees By Department":
//                 viewAllEmployeesByDepartment();
//                 break;
//             case "View All Employees By Manager":
//                 viewAllEmployeesByManager();
//                 break;
//             case "Add Employee":
//                 addEmployee();
//                 break;
//             case "Remove Employee":
//                 removeEmployee();
//                 break;
//             case "Update Employee Role":
//                 updateEmployeeRole();
//                 break;
//             case "Update Employee Manager":
//                 updateEmployeeManager();
//                 break;
//             case "View All Roles":
//                 viewAllRoles();
//                 break;
//             case "Add Role":
//                 addRole();
//                 break;
//             case "Remove Role":
//                 removeRole();
//                 break;
//             case "View All Departments":
//                 viewAllDepartments();
//                 break;
//             case "Add Department":
//                 addDepartment();
//                 break;
//             case "Remove Department":
//                 removeDepartment();
//                 break;
//             case "Quit":
//                 quit();
//                 break;
//         }
//     });
// }

