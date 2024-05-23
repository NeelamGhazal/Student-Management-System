#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.magentaBright("\t\t    ", "-".repeat(60)));
console.log(chalk.bgMagentaBright.bold("\t\t\t  <<<<<<<Welcome to Student Management System>>>>>>   "));
console.log(chalk.magentaBright("\t\t    ", "-".repeat(60)));
console.log(chalk.cyanBright("-".repeat(130)));
// Define variables to store previous transaction details
let lastPaymentMethod = "";
let lastPaymentAmount = 0;
/***************************** Defining a student class *****************************/
class Student {
    static counter = 10000;
    id;
    name;
    courses;
    balance;
    constructor(name) {
        this.id = Student.counter++;
        this.name = name;
        this.courses = [];
        this.balance = 10000;
    }
    /*************** Student Methods Start ***************/
    // Method to enroll a student in a course
    enroll_course(course, fee, method) {
        if (this.balance >= fee) {
            this.courses.push(course);
            this.balance -= fee;
            console.log(chalk.cyanBright("-".repeat(130)));
            console.log(chalk.yellowBright(`Congratulations, ${this.name}! You've successfully enrolled in the ${course} Course!`));
            console.log(chalk.cyanBright("-".repeat(130)));
            // Store the transaction details
            lastPaymentMethod = method;
            lastPaymentAmount = fee;
        }
        else {
            console.log(chalk.redBright(`Insufficient balance to enroll in ${course}.`));
        }
    }
    // Method to view a student balance
    view_balance() {
        console.log(chalk.cyanBright("-".repeat(130)));
        console.log(chalk.greenBright(`${this.name} balance is : $${this.balance}.`));
        console.log(chalk.cyanBright("-".repeat(130)));
    }
    // Method to pay student fees
    pay_fees(amount, method) {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(chalk.cyanBright("-".repeat(130)));
            console.log(chalk.greenBright(`${this.name} $${amount} fee has been paid successfully.`));
            console.log(chalk.greenBright(`Remaining Balance: $${this.balance}`));
            // Store the transaction details
            lastPaymentMethod = method;
            lastPaymentAmount = amount;
        }
        else {
            console.log(chalk.redBright(`Insufficient balance to pay $${amount}.`));
        }
    }
    // Method to display student status
    showStatus() {
        console.log(chalk.cyanBright("-".repeat(130)));
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Balance: ${this.balance}`);
        console.log(`Enrolled courses: ${this.courses.join(", ")}`);
        console.log(chalk.cyanBright("-".repeat(130)));
    }
}
/***************************** Defining a student-manager class to manage students *****************************/
class StudentManager {
    students;
    constructor() {
        this.students = [];
    }
    // Method to add a new Student
    add_student(name) {
        let stdnt = new Student(name);
        this.students.push(stdnt);
        console.log(chalk.cyanBright("-".repeat(130)));
        console.log(chalk.greenBright(`Student: '${name}' added successfully. Student ID: ${stdnt.id}.`));
        console.log(chalk.cyanBright("-".repeat(130)));
    }
    // Method to remove a Student
    remove_student(student_id) {
        const index = this.students.findIndex((student) => student.id === student_id);
        if (index !== -1) {
            this.students.splice(index, 1);
            console.log(chalk.cyanBright("-".repeat(130)));
            console.log(chalk.greenBright(`Student with ID: ${student_id} removed successfully.`));
            console.log(chalk.cyanBright("-".repeat(130)));
        }
        else {
            console.log(chalk.redBright("Student not found. Please enter a correct student ID"));
        }
    }
    // Method to enroll a student in a course
    async enroll_student(student_id, course, fee) {
        let student_found = this.find_student(student_id);
        if (student_found) {
            console.log(chalk.cyanBright("-".repeat(130)));
            console.log(chalk.greenBright(`Course Fee for ${course}: $${fee}`));
            console.log(chalk.cyanBright("-".repeat(130)));
            // Ask for payment method
            let payment_input = await inquirer.prompt([
                {
                    name: "method",
                    type: "list",
                    message: "Choose a payment method for the course fee:",
                    choices: ["EasyPaisa", "PayPal", "Fonepay", "JazzCash", "Moneygram"],
                },
            ]);
            if (payment_input.method) {
                student_found.enroll_course(course, fee, payment_input.method);
            }
            else {
                console.log(chalk.redBright("Payment method not selected. Enrollment failed."));
            }
        }
        else {
            console.log(chalk.redBright("Student not found. Please enter a correct student ID"));
        }
    }
    // Method to view a student balance
    view_student_balance(student_id) {
        let student_found = this.find_student(student_id);
        if (student_found) {
            student_found.view_balance();
        }
        else {
            console.log(chalk.redBright("Student not found. Please enter a correct student ID"));
        }
    }
    // Method to pay student fees
    async pay_student_fees(studentId, amount, method) {
        let student_found = this.find_student(studentId);
        if (student_found) {
            student_found.pay_fees(amount, method);
        }
        else {
            console.log(chalk.redBright("Student not found. Please enter a correct student ID"));
        }
        console.log(chalk.cyanBright("-".repeat(130)));
    }
    // Method to display student status
    show_student_status(studentId) {
        let studentFound = this.find_student(studentId);
        if (studentFound) {
            studentFound.showStatus();
        }
        else {
            console.log(chalk.redBright("Student not found. Please enter a correct student ID"));
        }
    }
    // Method to find a student by student id
    find_student(studentId) {
        return this.students.find((std) => std.id === studentId);
    }
}
/***************************** Main Function to run the program *****************************/
// Main Function to run the program
async function main() {
    let studentManager = new StudentManager();
    // Tuition fees for courses
    let tuitionFees = {
        "HTML/CSS Basics": 2500,
        "JavaScript Fundamentals": 3000,
        "Python Programming": 4000,
        "Data Structures & Algorithms": 3000,
        "Web Development Bootcamp": 4500,
        "C++ Programming": 3000,
    };
    // While loop to keep program running
    while (true) {
        let choice = await inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: chalk.yellowBright("Choose an option"),
                choices: [
                    "Add Student",
                    "Remove Student",
                    "Enroll Student",
                    "View Student Balance",
                    "Pay Student Fees",
                    "Show Student Status",
                    "Exit",
                ],
            },
        ]);
        // Using switch case to handle user choice
        switch (choice.choice) {
            case "Add Student":
                let name_input = await inquirer.prompt([
                    {
                        name: "name",
                        type: "input",
                        message: "Enter a Student Name:",
                        validate: function (value) {
                            if (value.trim() !== "")
                                return true;
                            return "Make sure the input is not empty";
                        },
                    },
                ]);
                studentManager.add_student(name_input.name);
                break;
            case "Remove Student":
                let remove_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID to remove:",
                    },
                ]);
                studentManager.remove_student(remove_input.student_id);
                break;
            case "Enroll Student":
                let course_choices = Object.keys(tuitionFees);
                let course_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID:",
                    },
                    {
                        name: "course",
                        type: "list",
                        message: "Choose a Course to Enroll:",
                        choices: course_choices,
                    },
                ]);
                await studentManager.enroll_student(course_input.student_id, course_input.course, tuitionFees[course_input.course]);
                break;
            case "View Student Balance":
                let balance_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID:",
                    },
                ]);
                studentManager.view_student_balance(balance_input.student_id);
                break;
            case "Pay Student Fees":
                let fees_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID:",
                    },
                    {
                        name: "payment",
                        type: "list",
                        message: "Choose a payment method:",
                        choices: ["EasyPaisa", "PayPal", "Fonepay", "JazzCash", "Moneygram"],
                    },
                    {
                        name: "amount",
                        type: "input",
                        message: "Enter the amount to pay:",
                        validate: function (value) {
                            if (value.trim() !== "" && !isNaN(parseFloat(value)))
                                return true;
                            return "Make sure the input is a valid number";
                        },
                    },
                ]);
                studentManager.pay_student_fees(fees_input.student_id, parseFloat(fees_input.amount), fees_input.payment);
                break;
            case "Show Student Status":
                let status_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID:",
                    },
                ]);
                studentManager.show_student_status(status_input.student_id);
                break;
            case "Exit":
                console.log("Exiting...");
                process.exit();
        }
    }
}
// Calling the main function
main();
