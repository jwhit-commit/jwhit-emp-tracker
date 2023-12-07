const inquirer = require('inquirer');
const db = require('../server.js');



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
        if(ans.task === 'view all departments') {
            console.log("Find all departments displayed below.\n");
            const query = `SELECT * FROM department;`;
            db.query(query, (err, result) => {
                console.log(result); res.json(results)
            })
        }
    })
};


module.exports = queryDB