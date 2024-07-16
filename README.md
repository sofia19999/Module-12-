# Employee Tracker

This is a command-line application to manage a company's employee database using Node.js, Inquirer, and PostgreSQL.

## Installation

1. Clone the repository.
2. Run `npm install` to install the necessary packages.
3. Set up your PostgreSQL database and configure the connection in `db/queries.js`.
4. Run the following commands to set up the database schema and seed data:
    ```bash
    psql -U postgres-d your_database_name -f db/schema.sql
    psql -U postgres -d your_database_name -f db/seeds.sql
    ```
5. Run `node index.js` to start the application.

## Usage

Follow the on-screen prompts to view and manage departments, roles, and employees.

## Features

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role
- Update an employee manager
- View employees by manager
- View employees by department
- Delete a department
- Delete a role
- Delete an employee
- View the total utilized budget of a department