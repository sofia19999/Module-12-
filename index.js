
const inquirer = require('inquirer');
const queries = require('./db/queries');  // Ensure this path is correct
const chalk = require('chalk');

const mainMenu = () => {
  inquirer.prompt({
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
  }).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        queries.getDepartments().then(res => {
          console.table(res.rows);
          mainMenu();
        }).catch(err => console.error(err));
        break;
      case 'View all roles':
        queries.getRoles().then(res => {
          console.table(res.rows);
          mainMenu();
        }).catch(err => console.error(err));
        break;
      case 'View all employees':
        queries.getEmployees().then(res => {
          console.log(res);  // Debugging: Log the result
          if (res.rows.length === 0) {
            console.log(chalk.red('No employees found.'));
          } else {
            console.table(res.rows);
          }
          mainMenu();
        }).catch(err => console.error(err));
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        queries.client.end();
        break;
    }
  });
};

const addDepartment = () => {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  }).then(answer => {
    queries.addDepartment(answer.name).then(() => {
      console.log(chalk.green('Department added successfully!'));
      mainMenu();
    }).catch(err => console.error(err));
  });
};

const addRole = async () => {
  const departments = await queries.getDepartments();
  const departmentChoices = departments.rows.map(dept => ({
    name: dept.name,
    value: dept.id
  }));

  inquirer.prompt([
    { name: 'title', type: 'input', message: 'Enter the title of the role:' },
    { name: 'salary', type: 'input', message: 'Enter the salary of the role:' },
    { name: 'department_id', type: 'list', message: 'Select the department for the role:', choices: departmentChoices }
  ]).then(answer => {
    queries.addRole(answer.title, answer.salary, answer.department_id).then(() => {
      console.log(chalk.green('Role added successfully!'));
      mainMenu();
    }).catch(err => console.error(err));
  });
};

const addEmployee = async () => {
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

  inquirer.prompt([
    { name: 'first_name', type: 'input', message: 'Enter the first name of the employee:' },
    { name: 'last_name', type: 'input', message: 'Enter the last name of the employee:' },
    { name: 'role_id', type: 'list', message: 'Select the role of the employee:', choices: roleChoices },
    { name: 'manager_id', type: 'list', message: 'Select the manager of the employee:', choices: managerChoices }
  ]).then(answer => {
    queries.addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id).then(() => {
      console.log(chalk.green('Employee added successfully!'));
      mainMenu();
    }).catch(err => console.error(err));
  });
};

const updateEmployeeRole = async () => {
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

  inquirer.prompt([
    { name: 'employee_id', type: 'list', message: 'Select the employee to update:', choices: employeeChoices },
    { name: 'role_id', type: 'list', message: 'Select the new role:', choices: roleChoices }
  ]).then(answer => {
    queries.updateEmployeeRole(answer.employee_id, answer.role_id).then(() => {
      console.log(chalk.green('Employee role updated successfully!'));
      mainMenu();
    }).catch(err => console.error(err));
  });
};

mainMenu();