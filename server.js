const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Table = require('cli-table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Copperh3adroad',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

console.log('\n\n\nWelcome to your internal resource manager!\n');

const queryDB = () => {
  inquirer
      .prompt([
          {
              type: 'list',
              name: 'task',
              message: 'How would you like to begin?',    
              choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee','update an employee role',],
          }])
      .then((ans) => {
          if (ans.task === 'view all departments') {
              console.log("Find all departments displayed below.\n");
              const query = `SELECT * FROM department;`;
              db.query(query, (err, result) => {
                  console.table(result);
                  console.log("\n");
                  queryDB();
              });
          } if (ans.task === 'view all roles') {
            console.log("Find all roles displayed below.\n");
            const query = `SELECT * FROM role;`;
            db.query(query, (err, result) => {
                console.table(result);
                console.log("\n");
                queryDB();
            });
          } if (ans.task === 'view all employees') {
            console.log("Find all employees displayed below.\n");
            const query = `SELECT * FROM employee;`;
            db.query(query, (err, result) => {
                console.table(result)
                console.log("\n");
                queryDB();
            });
          } if (ans.task === 'add a department') {
            inquirer.prompt([
              {
                  type: 'input',
                  name: 'deptname',
                  message: 'What would you like to call the new department?',    
              }])
              .then((ans) => {
                const query = 'INSERT INTO department (name) VALUES (?)';
                db.query(query, [ans.deptname], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
                console.log("\n");
                console.log("New " + ans.deptname + " department added to database\n");
                queryDB();
              })})
          } if (ans.task === 'add a role') {

            const deptsGet = () => {
              const query = `SELECT name FROM department;`;
            
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    const depts = results.map(result => result.name);
                    const deptsNum = depts.map((item, index) => {return `${index + 1}. ${item}`;})
                    resolve(deptsNum);
                  }
                });
              });
            };

            const inquireRole = async () => {
              try {
                const deptsNum = await deptsGet();
            
                const ans = await inquirer.prompt([
                  {
                    type: 'input',
                    name: 'rolename',
                    message: 'What would you like to call the new role?',    
                  },
                  {
                    type: 'number',
                    name: 'rolesalary',
                    message: 'What will the salary be for the new role?',    
                  },
                  {
                    type: 'list',
                    name: 'roledept',
                    message: 'Select a department:',
                    choices: deptsNum
                  }
                ]);

                deptId = ans.roledept.split('.')[0]
                console.log(deptId)
                
                const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
                db.query(query, [ans.rolename, ans.rolesalary, deptId], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }})
                console.log("\n");
                console.log("New " + ans.rolename + " role added to database\n");
                queryDB();

                
              } catch (error) {
                console.error('Error fetching department names:', error);
              } 
            };

            inquireRole();
          } if (ans.task === 'add an employee') {

            const rolesGet = () => {
              const query = `SELECT title FROM role;`;
            
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    const roles = results.map(result => result.title);
                    const rolesNum = roles.map((item, index) => {return `${index + 1}. ${item}`;})
                    resolve(rolesNum);
                  }
                });
              });
            };

            const empGet = () => {
              const query = `SELECT first_name, last_name FROM employee;`;
            
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    // Use result.name instead of result.department_name
                    const emps = results.map(result => result.first_name + " " + result.last_name);
                    const empsNum = emps.map((item, index) => {return `${index + 1}. ${item}`;})
                    resolve(empsNum);
                  }
                });
              });
            };


            const inquireEmp = async () => {
              try {
                const rolesNum = await rolesGet();
                const empsNum = await empGet();

                const ans = await inquirer.prompt([
                  {
                    type: 'input',
                    name: 'firstname',
                    message: 'What is this employees first name?',    
                  },
                  {
                    type: 'input',
                    name: 'lastname',
                    message: 'What is this employees last name?',    
                  },
                  {
                    type: 'list',
                    name: 'role',
                    message: 'Select a role:',
                    choices: rolesNum
                  },
                  {
                    type: 'list',
                    name: 'manager',
                    message: 'Select a manager:',
                    choices: empsNum
                  }
                ]);

                roleId = ans.role.split('.')[0]
                empID = ans.manager.split('.')[0]
                
                
                const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                db.query(query, [ans.firstname, ans.lastname, roleId, empID], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }})
                console.log("\n");
                console.log("New employee (" + ans.firstname + " " + ans.lastname + ") role added to database\n");
                queryDB();

                
              } catch (error) {
                console.error('Error fetching department names:', error);
              } 
            };

            inquireEmp();
          } if (ans.task === 'update an employee role') {

            const rolesGet = () => {
              const query = `SELECT title FROM role;`;
            
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    const roles = results.map(result => result.title);
                    const rolesNum = roles.map((item, index) => {return `${index + 1}. ${item}`;})
                    resolve(rolesNum);
                  }
                });
              });
            };

            const empGet = () => {
              const query = `SELECT first_name, last_name FROM employee;`;
            
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    // Use result.name instead of result.department_name
                    const emps = results.map(result => result.first_name + " " + result.last_name);
                    const empsNum = emps.map((item, index) => {return `${index + 1}. ${item}`;})
                    resolve(empsNum);
                  }
                });
              });
            };


            const changeRole = async () => {
              try {
                const rolesNum = await rolesGet();
                const empsNum = await empGet();

                const ans = await inquirer.prompt([
                  {
                    type: 'list',
                    name: 'emp',
                    message: 'Which employee needs updated?',
                    choices: empsNum
                  },
                  {
                    type: 'list',
                    name: 'role',
                    message: 'What is their new role?',
                    choices: rolesNum
                  }
                ]);

                roleId = ans.role.split('.')[0]
                empID = ans.emp.split('.')[0]
                
                
                const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                db.query(query, [roleId, empID], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
                  if (result.affectedRows > 0) {
                    console.log('Update successful');
                  } else {
                    console.log('No rows matched the condition, or no changes were made');
                  }
                })
                console.log("\n");
                queryDB();

                
              } catch (error) {
                console.error('Error fetching department names:', error);
              } 
            };

            changeRole();
          }
        })
  };


  


queryDB();