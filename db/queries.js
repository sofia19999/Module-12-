const client = require('./connection');

const getDepartments = () => client.query('SELECT * FROM department');
const getRoles = () => client.query(`
  SELECT role.id, role.title, role.salary, department.name AS department
  FROM role
  LEFT JOIN department ON role.department_id = department.id
`);
const getEmployees = () => client.query(`
  SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
         CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role ON e.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee m ON e.manager_id = m.id
`);

const addDepartment = (name) => client.query('INSERT INTO department (name) VALUES ($1)', [name]);
const addRole = (title, salary, department_id) => client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
const addEmployee = (first_name, last_name, role_id, manager_id) => client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);

const updateEmployeeRole = (employee_id, role_id) => client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};