const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { ColdObservable } = require('rxjs/internal/testing/ColdObservable');
const { connect } = require('http2');

require('dotenv').config()

//connects to the database

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'W@lker!',
        database: 'tracker_db'
    });
    
// connects to the mysql database

connection.connect(function(err){
    if(err) return console.log(err);
    InquirerPrompt();
})

//prompts 
const InquirerPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update all departments',
                'Update employee infomation',
                'Exit'
            ]
        }
    ])

    .then((answer) => {
        const { choices } = answers;

        if (choices === "View all departments"){
            viewDepartment();
        }

        if(choices === "View all roles"){
            viewRoles();
        }

        if (choices === "View all employees"){
            viewEmployees();
        }

        if(choices === "Add department"){
            addDepartment();
        }

        if (choices === "Add role"){
            addRole();
        }

        if (choices === "Add employee"){
            addEmployee();
        }

        if (choices === "Update all departments"){
            allDepartments();
        }

        if (choices === "Update employee infomation"){
            employeeInfomation();
        }

        if (choices === "Exit"){
            db.end();
        }
    });
};

// Departments infomation
showDepartments = () => {
    console.log('All departments are showing.');
    const mysql = `SELECT department.id AS id, department.name AS department FROM department`;

    connections.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    });
}

//show roles
showRoles = () => {
    console.log('Show all roles.');

    const mysql = `SELECT role.id, role.title, department.name AS department FROM role`;

    connection.query(mysql, (err,rows) => {
        console.table(rows);
        InquirerPrompt();
    })
};

//add roles infomation
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What do you want to add?",

        },
        {
            type:'input',
            name: 'yearly_income',
            message: 'What is your yearly income?',
        }
    ])
        .then(answer => {
            const parameters = [answer.role, answer.yearly_income];
            const role_var = `SELECT name, id FROM department`;

            connection.query (role_var, (err, data) => {
                if (err) return console.log(err);
                const department_var = data.map(({ name, id }) => ({ name: name, value: id}));
                
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_var',
                message: "What department is this role in?",
                choices: department_var
            }
        ])
        .then(department_varChoice => {
            const department_var = department_varChoice.department_var;
            parameters.push(department_var);
            const mysql = `INSET INTO rol (title, yearly_income, department_id) VALUES (?,?,?)`;

            connection.query(mysql, parameters, (err, result) => {
                if (err) return console.log(err);
                console.log('Added' + answer.role + "to roles");
                showRoles();
            });
        });
     });
    });
};

//show employees
showEmployees = () => {
    console.log('All employees are showing.');
    const mysql = `SELECT employee.id, employee.first_name, employee.lastname, role.title, department.name AS department, role.yearly_income, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connect.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    });
};

//update employees
updateEmployee = () => {
    const employeemysql = `SELECT * FROM employee`;

    connection.query(employeemysql, (err, data) => {
        
        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value:id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do we want to update?',
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const parameters = [];
                parameters.push(employee);

                const role_var = `SELECT * FROM role`;

                connection.query(role_var, (err, data) => {
                    if(err) return console.log(err);
                    const roles = data.map(({ id, title }) => ({ name: title, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role?',
                            choices: roles
                        }
                    ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        parameters.push(role);
                        let employee = parameters[0]
                        parameters[0] = role
                        parameters[1] = employee
                        const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                        connection.query(mysql, parameters, (err, result) => {
                            if (err) return console.log(err);
                            console.log('Role has been updated.');

                        showEmployees();
                        })
                    })
                })
            })
    })
};

//Update/ADD Department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What department do you want to add?',
        }
    ])
    .then(answer => {
        const mysql =`INSERT INTO department (name) VALUES (?)`;
        connection.query(mysql, answer.department, (err, results) => {
            if (err) return console.log(err);
            console.log ('Added' + answer.department + "to departments");

            showDepartments();
        });
    });
}
