const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var employees = [];

function init() {
    createHTML();
    addEmployee();
}

function addEmployee() {
    inquirer.prompt([{
        name: 'name',
        message: "Enter team member's name",
        /* Pass your questions in here */
        },
        {
        name: 'role',
        type: "list",
        message: "Select team member's role",
        choices: [
            "Manager",
            "Intern",
            "Engineer",
            ]
        },
        {
        name: "id",
        message: "Enter team member ID",
        },
        {
        name: "email",
        message: "Enter team member email",
        },
    ])
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "Github username";
        }
        else if (role === "Intern") {
            roleInfo = "school name";
        }
        else if (role === "Manager") {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Add more members?",
            choices: [
                'yes',
                'no'
            ],
            name: "moreMembers"
        }])
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            }
            else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            }
            else if (role === "Manager") {
                newMember = new Manager(name, id, email, roleInfo);
            }
            employees.push(newMember);
            addHTML(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    addEmployee();
                }
                else {
                    completeHtml();
                }
            })
        });
    });
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

init();

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
