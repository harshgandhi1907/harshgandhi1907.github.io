import { username, password, handleLogin} from './index';
document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        // Make a request to fetch data
        const encodedUsername = encodeURIComponent(username);
        // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27';
        // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27+Password__c+=+%27harsh1907%27';
        const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27'+encodedUsername+'%27';
        const accessToken = '00D5h0000093stB!ARMAQL8.DAMQJIaA7A3EIc32Pbpept0OA6Wv0uLc5YVZGJLZ4wUtRvDUu0wVmRf8jTW8nGQYDau.YQzCkCfIaOPsdI.tFfi7'; // Replace with your Salesforce access token

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

        expenseForm.addEventListener("submit", async (e) => {
            try {
                e.preventDefault();
                const name = document.getElementById("expense-name").value;
                const amount = parseFloat(document.getElementById("expense-amount").value);
                
                if (name && amount) {
                    expenses.push({ name, amount });
                    totalExpense += amount;
                    updateUI();
                    // addExpenseToSalesforce(name,amount);
                    expenseForm.reset();
                    toggleExpenseListVisibility();
                } else{
                    alert('something went wrong !! Record not stored')
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