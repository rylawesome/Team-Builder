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
        //gets name
        name: 'name',
        message: "Enter team member's name",
        },
        {
        //gets role
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
        //gets id
        name: "id",
        message: "Enter team member ID",
        },
        {
        //gets email
        name: "email",
        message: "Enter team member email",
        },
    ])
    //takes previous info, checks employee type, and gets relevant info
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
        //asks for github username,school name, office phone#, respectively
            message: `Enter team member ${roleInfo}`,
            name: "roleInfo"
        },
        {
        //checks if more members need to be added
            type: "list",
            message: "Add more members?",
            choices: [
                'yes',
                'no'
            ],
            name: "moreMembers"
        }])
        //applies info from inquirer to classes
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
            //pushes to array
            employees.push(newMember);
            //creates HTML for new member
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

//initial HTML file
function createHTML() {
    const html = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <title>Team Profile</title>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-dark mb-5">
            <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
        </nav>
        <div class="container">
            <div class="row">`;
    //writes to the output/team file
    fs.writeFile("./output/team.html", html, function(err) {
    //debugging
        if (err) {
            console.log(err);
        }
    });
    //give user response
    console.log("start");
}

//updates HTML with member info
function addHTML(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        //if statement to change function called from getGithub to getSchool, etc.
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <h5 class="card-header">${name}<br /><br />Engineer</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">GitHub: ${gitHub}</li>
            </ul>
            </div>
        </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <h5 class="card-header">${name}<br /><br />Intern</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">School: ${school}</li>
            </ul>
            </div>
        </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data = `<div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
            <h5 class="card-header">${name}<br /><br />Manager</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">ID: ${id}</li>
                <li class="list-group-item">Email Address: ${email}</li>
                <li class="list-group-item">Office Phone: ${officePhone}</li>
            </ul>
            </div>
        </div>`
        }
        console.log("adding team member");
        //debugging
        fs.appendFile("./output/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
}

//closes the HTMl file
function completeHtml() {
    const html = ` </div>
    </div>
    </body>
    </html>`;

    fs.appendFile("./output/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("end");
}

//Create base HTML file and run addEmployee function
init();
