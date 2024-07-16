const inquirer = require('inquirer');
const queries = require('./queries');
const chalk = require('chalk');

const mainMenu = () => {
  return inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  });
};

const addDepartmentPrompt = () => {
  return inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  });
};

const addRolePrompt = async () => {
  const departments = await queries.getDepartments();
  const departmentChoices = departments.rows.map(dept => ({
    name: dept.name,
    value: dept.id
  }));

  return inquirer.prompt([
    { name: 'title', type: 'input', message: 'Enter the title of the role:' },
    { name: 'salary', type: 'input', message: 'Enter the salary of the role:' },
    { name: 'department_id', type: 'list', message: 'Select the department for the role:', choices: departmentChoices }
  ]);
};

const addEmployeePrompt = async () => {
  const roles = await queries.getRoles();
  const roleChoices = roles.rows.map(role => ({
    name: `${role.title} (${role.department})`,
    value: role.id
  }));

  const employees = await queries.getEmployees();
  const managerChoices = employees.rows.map(emp => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id
  }));
  managerChoices.unshift({ name: 'None', value: null });

  return inquirer.prompt([
    { name: 'first_name', type: 'input', message: 'Enter the first name of the employee:' },
    { name: 'last_name', type: 'input', message: 'Enter the last name of the employee:' },
    { name: 'role_id', type: 'list', message: 'Select the role of the employee:', choices: roleChoices },
    { name: 'manager_id', type: 'list', message: 'Select the manager of the employee:', choices: managerChoices }
  ]);
};

const updateEmployeeRolePrompt = async () => {
  const employees = await queries.getEmployees();
  const employeeChoices = employees.rows.map(emp => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id
  }));

  const roles = await queries.getRoles();
  const roleChoices = roles.rows.map(role => ({
    name: `${role.title} (${role.department})`,
    value: role.id
  }));

  return inquirer.prompt([
    { name: 'employee_id', type: 'list', message: 'Select the employee to update:', choices: employeeChoices },
    { name: 'role_id', type: 'list', message: 'Select the new role:', choices: roleChoices }
  ]);
};

module.exports = {
  mainMenu,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt
};

