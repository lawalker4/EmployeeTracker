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
        password: process.env.PASSWORD,
        database: 'employee.tracker_db'
    });
    
// connects to the mysql database




