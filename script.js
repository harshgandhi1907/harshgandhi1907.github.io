document.addEventListener("DOMContentLoaded", () => {
    try {
        const expenseForm = document.getElementById("expense-form");
        const expenseList = document.getElementById("expense-list");
        const balance = document.getElementById("balance");
        const expensesContainer = document.getElementById("expenses-container");

        let expenses = [];
        let totalExpense = 0;
        // const consumer_key = "3MVG95mg0lk4bath_h7i4xZH5uzPYZ_0FZuNbtNGb2eyGFnf3SlckXUQtOAQ56jluM1ChiUBLbI_RTXPbgPF3";
        // const consumer_secret =  "38C1EF975BA58FBF9FD2C5DA0AC44264B3717D90800101CAD79CA6825715B3C8";
        const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";
        async function addExpenseToSalesforce(name, amount) {
            try {
                const accessToken = "00D5h0000093stB!ARMAQIogQ9EhD18VWLG4kuLYREUgdgv3Es41x_08L9p1BbBalbZ6R7fS_xHAemSm.7yNnlujv7pTVZPp1Qv8Ap8sPDeO5mac";

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                };
        
                const requestBody = JSON.stringify({
                    "Name": name,
                    "Expense_Amount__c": amount
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

        const salesforceQueryEndpoint = "https://expensetrackerportal-dev-ed.my.salesforce.com/services/data/v58.0/query/";
        async function fetchExpensesFromSalesforce(username, password) {
            try {
                const accessToken = "00D5h0000093stB!ARMAQIogQ9EhD18VWLG4kuLYREUgdgv3Es41x_08L9p1BbBalbZ6R7fS_xHAemSm.7yNnlujv7pTVZPp1Qv8Ap8sPDeO5mac"; // Make sure to replace with a valid access token

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                };

                const query = `SELECT Name, Expense_Amount__c FROM Expense__c WHERE User_Name__c = '${username}' AND Password__c ='${password}'`;

                const response = await fetch(`${salesforceQueryEndpoint}?q=${encodeURIComponent(query)}`, {
                    method: "GET",
                    headers,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Expenses fetched from Salesforce:", data);
                    // Process the fetched data here
                } else {
                    console.error("Failed to fetch expenses from Salesforce:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching expenses from Salesforce:", error);
            }
        }

        expenseForm.addEventListener("submit", async (e) => {
            try {
                e.preventDefault();
                const name = document.getElementById("expense-name").value;
                const amount = parseFloat(document.getElementById("expense-amount").value);
                
                if (name && amount) {
                    expenses.push({ name, amount });
                    totalExpense += amount;
                    addExpenseToSalesforce(name, amount); // Add the expense to Salesforce
                    updateUI();
                    expenseForm.reset();
                    toggleExpenseListVisibility();
                    fetchExpensesFromSalesforce('harsh1907','harsh1907');
                }
            } catch (error) {
                console.log('error in submit action ==> ' + error);
                console.log('Line number ==> ' + error.lineNumber);
            }
        });

        // Function to toggle visibility of the expense list based on expense addition
        function toggleExpenseListVisibility() {
            try {
                expensesContainer.style.display = expenses.length > 0 ? "block" : "none";
            } catch (error) {
                console.log('error in toggle expense ==> ' + error);
                console.log('Line number ==> ' + error.lineNumber);
            }
        }

        // Adding new expense lines
        function updateUI() {
            try {
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
        
        // remove expense lines
        window.removeExpense = (index) => {
            try {
                const removedExpense = expenses.splice(index, 1)[0];
                totalExpense -= removedExpense.amount;
                updateUI();
                toggleExpenseListVisibility();
            } catch (error) {
                console.log('error in removeExpnese ==> ' + error);
                console.log('Line number ==> ' + error.lineNumber); 
            }
        };
    } catch (error) {
        console.log('error in DOMContentLoaded ==> ' + error);
        console.log('Line number ==> ' + error.lineNumber);
    }
});



// login signup

let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
 
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});
 
login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});