let expenses = [];
let totalExpense = 0;
let globalUsername = '';
let globalPassword = '';
document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        if (window.location.href === 'https://harshgandhi1907.github.io' || window.location.href === 'https://harshgandhi1907.github.io/index.html' || window.location.href === 'https://harshgandhi1907.github.io/') {
            try {
                console.log('onload if');
                const forms = document.querySelector(".forms"),
                    pwShowHide = document.querySelectorAll(".eye-icon"),
                    links = document.querySelectorAll(".link");

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
                        })
                    })
                })

                links.forEach(link => {
                    link.addEventListener("click", e => {
                        e.preventDefault(); //preventing form submit
                        forms.classList.toggle("show-signup");
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
        } else if (window.location.href === 'https://harshgandhi1907.github.io/home.html') {
            console.log('onload else if');
            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');
            if(storedUsername != '' && storedPassword != ''){
                // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27';
                // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27+Password__c+=+%27harsh1907%27';
                const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27'+storedUsername+'%27';
                console.log(salesforceQEndpoint);
                const accessToken = '00D5h0000093stB!ARMAQI8LzJ3rRDdH4n5HHkliPZzbCKd0WveH0MGo029O81uz7ZGoK0aWGk2z4R5Dr65n2qGTBb1RZ_ojVLRwLpqotPyVpU3E'; // Replace with your Salesforce access token

                const response = await fetch(salesforceQEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response);

                if (response.ok) {
                    const data = await response.json();
                    // Handle the Salesforce data
                    console.log(data);
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

                        if (name && amount) {
                            expenses.push({ name, amount });
                            totalExpense += amount;
                            updateUI();
                            addExpenseToSalesforce(name, amount);
                            expenseForm.reset();
                            toggleExpenseListVisibility();
                        } else {
                            alert('something went wrong !! Record not stored')
                        }
                    } catch (error) {
                        console.log('error in submit action ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                });

                // Adding new expense lines
                const balance = document.getElementById("balance");
                const expenseList = document.getElementById("expense-list");
                function updateUI() {
                    try {
                        console.log('updateUI');
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
                const expensesContainer = document.getElementById("expenses-container");
                function toggleExpenseListVisibility() {
                    try {
                        console.log('toggle meth');
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
                        updateUI();
                        toggleExpenseListVisibility();
                    } catch (error) {
                        console.log('error in removeExpnese ==> ' + error);
                        console.log('Line number ==> ' + error.lineNumber);
                    }
                };

                async function addExpenseToSalesforce(name, amount) {
                    try {
                        console.log('add expense callout meth');
                        // const consumer_key = "3MVG95mg0lk4bath_h7i4xZH5uzPYZ_0FZuNbtNGb2eyGFnf3SlckXUQtOAQ56jluM1ChiUBLbI_RTXPbgPF3";
                        // const consumer_secret =  "38C1EF975BA58FBF9FD2C5DA0AC44264B3717D90800101CAD79CA6825715B3C8";
                        const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";
                        const accessToken = "00D5h0000093stB!ARMAQI8LzJ3rRDdH4n5HHkliPZzbCKd0WveH0MGo029O81uz7ZGoK0aWGk2z4R5Dr65n2qGTBb1RZ_ojVLRwLpqotPyVpU3E";

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