import {loadCSV} from './employeeService.js';
import db from './db.js';
import express from 'express';
const app = express();

const archive = 'employees.csv';
loadCSV(archive);

app.use(express.json());

app.post('/employee', (req, res) => {
    const data = req.body;
    const query = `
        INSERT INTO employees (name, lastname, lastname2, email, charge, city, salary, age)
        VALUES(?,?,?,?,?,?,?,?)
    `;
    const values = [
        data.name, 
        data.lastname, 
        data.lastname2, 
        data.email, 
        data.charge, 
        data.city, 
        data.salary, 
        data.age
    ];

    db.query(query, values, (err, dbRes) => {
        if(err){
            console.error('ERROR: could not be created', err.message);
            return res.status(500).json({ error: 'Could not be created', details: err.message });
        }
        res.status(201).json({
            idEmployee: dbRes.insertId
        });
    });
});

app.listen(3000, () => {
    console.log("Puerto corriendo por http://localhost:3000");
});