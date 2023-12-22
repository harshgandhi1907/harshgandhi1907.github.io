let globalUsername = '';
let globalPassword = '';
let signedUsername = '';
let signedPassword = '';
document.addEventListener("DOMContentLoaded", async (e) => {
    const accessToken = '00D5h0000093stB!ARMAQCgBfP38uPy57h_T0KWCOHGoBU9f.Gv.0n7wZuw6TQ1GdE8OUGO72njN0MU9PU6ZBvQNzr505KfITly6PuNdsqd8YSsh';
    try {
        if (window.location.href === 'https://harshgandhi1907.github.io' || window.location.href === 'https://harshgandhi1907.github.io/index.html' || window.location.href === 'https://harshgandhi1907.github.io/') {
            try {
                console.log('onload if');
                globalUsername = '';
                globalPassword = '';
                localStorage.setItem('username', globalUsername);
                localStorage.setItem('password', globalPassword);
                const pwShowHide = document.querySelectorAll(".eye-icon")

                pwShowHide.forEach(eyeIcon => {
                    eyeIcon.addEventListener("click", () => {
                        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

                        pwFields.forEach(password => {
                            if (password.type === "password") {
                                password.type = "text";
                                eyeIcon.classList.replace("bx-hide", "bx-show");
                                return;
                            }
                            password.type = "password";
                            eyeIcon.classList.replace("bx-show", "bx-hide");
                        });
                    });
                });

                // Event listener for username input change
                document.getElementById('usernameInput').addEventListener('input', function (event) {
                    globalUsername = event.target.value;
                    console.log('Username:', globalUsername);
                    localStorage.setItem('username', globalUsername);
                });

                // Event listener for password input change
                document.getElementById('passwordInput').addEventListener('input', function (event) {
                    globalPassword = event.target.value;
                    console.log('Password:', globalPassword);
                    localStorage.setItem('password', globalPassword);
                });
            } catch (error) {
                console.log('error in DOMContentLoaded login ==> ' + error);
                console.log('Line number ==> ' + error.lineNumber);
            }
        } else if (window.location.href === 'https://harshgandhi1907.github.io/Signup.html') {
            try {
                console.log('onload else if signup');
                // Event listener for username input change
                document.getElementById('usernameinput').addEventListener('input', function (event) {
                    signedUsername = event.target.value;
                    console.log('Signed Username:', signedUsername);
                    localStorage.setItem('signedUsername', signedUsername);
                });

                // Event listener for password input change
                document.getElementById('passwordinput').addEventListener('input', function (event) {
                    signedPassword = event.target.value;
                    console.log('Signed Password:', signedPassword);
                    localStorage.setItem('signedPassword', signedPassword);
                });

                window.customFunction = async function (e) {
                    try {
                        console.log('onclick signup');
                        e.preventDefault();
                        const newUname = document.getElementById('usernameinput').value;
                        const newPass = document.getElementById('passwordinput').value;
                        const newEmail = document.getElementById('emailinput').value;
                        if (newUname && newPass) {
                            createAccountToSalesforce(newUname, newPass, newEmail);
                        } else {
                            alert('something went wrong !! account not created');
                            return false;
                        }
                    } catch (error) {
                        console.log('error in submit action ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                        return false;
                    }
                }

                async function createAccountToSalesforce(newUname, newPass, newEmail) {
                    try {
                        console.log('create account callout meth');
                        const salesforceAccEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Account";

                        const headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        };

                        const requestBody = JSON.stringify({
                            "Name": newUname,
                            "Email__c": newEmail,
                            "UserName__c": newUname,
                            "Password__c": newPass
                            // Add other fields as needed for your Expense object
                        });

                        const response = await fetch(salesforceAccEndpoint, {
                            method: "POST",
                            headers,
                            body: requestBody,
                        });

                        if (response.ok) {
                            console.log("Account created to Salesforce!");
                            console.log(response);
                            return true;
                        } else {
                            console.error("Failed to create account to Salesforce:", response.statusText);
                            return false;
                        }
                    } catch (error) {
                        console.error("Error creating account to Salesforce:", error);
                        return false;
                    }
                }
            } catch(error){
                console.log('error in DOMContentLoaded signup ==> ' + error);
                console.log('Line number ==> ' + error.lineNumber);
            }
        } else if (window.location.href === 'https://harshgandhi1907.github.io/home.html') {
            console.log('onload else if home');
            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');
            let totalExpense = 0;
            if (storedUsername != '' && storedPassword != '') {
                // Get previous data if present
                // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27';
                // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27+Password__c+=+%27harsh1907%27';
                const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name,+Expense_Amount__c+FROM+Expense__c+WHERE+User_Name__c+=+%27' + storedUsername + '%27';
                console.log(salesforceQEndpoint);

                const response = await fetch(salesforceQEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    let expenses = [];
                    data.records.forEach(record => {
                        const expenseName = record.Name;
                        const expenseAmount = parseFloat(record.Expense_Amount__c);
                        console.log('id :: ' + record.Id);
                        console.log(`Name: ${expenseName}, Expense Amount: ${expenseAmount}`);
                        expenses.push({ name: expenseName, amount: expenseAmount });

                        // Calculate total expense
                        totalExpense += expenseAmount;
                        const balance = document.getElementById("balance");
                        balance.innerText = totalExpense;
                    });

                    toggleExpenseListVisibility(expenses);
                    
                    // Create a li element for each expense
                    const expenseList = document.getElementById("expense-list");
                    expenseList.innerHTML = "";
                    expenses.forEach((expense) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                        <span>${expense.name}</span>
                        <span>₹${expense.amount}</span>
                        `;
                        expenseList.appendChild(listItem);
                    });

                    toggleExpenseListVisibility(expenses);
                } else {
                    console.error('Failed to fetch data from Salesforce:', response.statusText);
                }

                const expenseForm = document.getElementById("expense-form");
                expenseForm.addEventListener("submit", async (e) => {
                    try {
                        console.log('onclick submit');
                        e.preventDefault();
                        const name = document.getElementById("expense-name").value;
                        const amount = parseFloat(document.getElementById("expense-amount").value);
                        let expenses = [];
                        if (name && amount) {
                            expenses.push({ name: name, amount: amount });
                            totalExpense += amount;
                            // updateUI();
                            addExpenseToSalesforce(name, amount);
                            // toggleExpenseListVisibility();
                            
                            // Create a li for the new expense
                            const expenseList = document.getElementById("expense-list");
                            expenses.forEach((expense) => {
                                const listItem = document.createElement("li");
                                listItem.innerHTML = `
                                <span>${expense.name}</span>
                                <span>₹${expense.amount}</span>
                                `;
                                expenseList.appendChild(listItem);
                            });
                            expenseForm.reset();
                        } else {
                            alert('something went wrong !! Record not stored')
                        }
                    } catch (error) {
                        console.log('error in submit action ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                });

                // Adding new expense lines
                function updateUI() {
                    try {
                        console.log('updateUI');
                        const expenseList = document.getElementById("expense-list");
                        expenseList.innerHTML = "";
                        expenses.forEach((expense) => {
                            const listItem = document.createElement("li");
                            listItem.innerHTML = `
                            <span>${expense.name}</span>
                            <span>₹${expense.amount.toFixed(2)}</span>
                            <button onclick="removeExpense(${expenses.indexOf(expense)})">Remove</button>
                            `;
                            expenseList.appendChild(listItem);
                        });
                        balance.innerText = totalExpense.toFixed(2);
                    } catch (error) {
                        console.log('error in updateUI ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                }

                // Function to toggle visibility of the expense list based on expense addition
                function toggleExpenseListVisibility(expenses) {
                    try {
                        console.log('toggle meth');
                        const expensesContainer = document.getElementById("expenses-container");
                        expensesContainer.style.display = expenses.length > 0 ? "block" : "none";
                    } catch (error) {
                        console.log('error in toggle expense ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                }

                window.removeExpense = (index) => {
                    try {
                        console.log('remove meth');
                        const removedExpense = expenses.splice(index, 1)[0];
                        totalExpense -= removedExpense.amount;
                        // updateUI();
                        // toggleExpenseListVisibility();
                    } catch (error) {
                        console.log('error in removeExpnese ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                };

                async function addExpenseToSalesforce(name, amount) {
                    try {
                        console.log('add expense callout meth');
                        const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";

                        const headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        };

                        const requestBody = JSON.stringify({
                            "Name": name,
                            "Expense_Amount__c": amount,
                            "User_Name__c": storedUsername,
                            "Password__c": storedPassword
                            // Add other fields as needed for your Expense object
                        });

                        const response = await fetch(salesforceEndpoint, {
                            method: "POST",
                            headers,
                            body: requestBody,
                        });

                        if (response.ok) {
                            console.log("Expense added to Salesforce!");
                            console.log(response);
                            const createdRecordId = response.id;
                            console.log("Created Record ID:", createdRecordId);
                            location.reload();
                        } else {
                            console.error("Failed to add expense to Salesforce:", response.statusText);
                        }
                    } catch (error) {
                        console.error("Error adding expense to Salesforce:", error);
                    }
                }
            } else {
                console.log('login credentials not fetched');
            }
        } else {
            console.log('onload else');
        }
    } catch (error) {
        console.log('error in DOMContentLoaded home ==> ' + error);
        console.log('Line number ==> ' + error.lineNumber);
    }
});

//login required field check
function validateLoginForm() {
    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;

    if (username == "" || password == "") {
        alert("Please fill in all fields.");
        return false;
    }

    window.location.replace("https://harshgandhi1907.github.io/home.html");
    return true;
}

//signup required fields check
function validateSignupForm() {
    var email = document.querySelector("#emailinput").value;
    var username = document.querySelector("#usernameinput").value;
    var password = document.querySelector("#passwordinput").value;
    var confirmPassword = document.querySelector("#confirmpasswordinput").value;

    if (email == "" || username == "" || password == "" || confirmPassword == "") {
        alert("Please fill in all fields.");
        return false;
    } else if (typeof customFunction === 'function') {
        // Call customFunction and return its result (true/false) to allow/prevent navigation
        return customFunction();
    }

    return false;
}