const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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
show 



       

        


    })
}


