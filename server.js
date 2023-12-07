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
                const sql = 'INSERT INTO department (name) VALUES (?)';
                db.query(sql, [ans.deptname], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
                console.log("\n");
                console.log("New " + ans.deptname + " department added to database\n");
                queryDB();
              })})
          } if (ans.task === 'add a role') {
            let depts = [];

            const deptsGet = () => {
              const query = `SELECT name FROM department;`;
              
              return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    depts = results.map(result => result.department_name);
                    resolve(depts);
                  }
            })})}

            deptsGet();


            // db.query(query, (err, result) => {
            //       depts = result.map(result => result.name);
            //   })
            // console.log(depts);
            // inquirer.prompt([
            //   {
            //       type: 'input',
            //       name: 'rolename',
            //       message: 'What would you like to call the new role?',    
            //   },
            //   {
            //       type: 'number',
            //       name: 'rolesalary',
            //       message: 'What will the salary be for the new role?',    
            //   },
            //   {
            //       type: 'list',
            //       name: 'roledept',
            //       message: 'What department will house the new role?', 
            //       choices: depts,   
            //   },
            // ])
            //   .then((ans) => {
            //     const query = `INSERT INTO department (name) VALUES (` + ans.deptname + `),;`;
            //     db.query(query, (err, result) => {
            //     });
            //     console.log("\n");
            //     console.log("New " + ans.deptname + " department added to database\n");
            //     queryDB();
            //   })
          }
        })
  };


queryDB();