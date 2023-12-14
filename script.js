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
        const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.lightning.force.com/services/data/v58.0/sobjects/Expense__c";
        async function addExpenseToSalesforce(name, amount) {
            try {
                const accessToken = "6Cel800D5h0000093stB8885h000000OynwCrXf1CoyP4GtJX3RpmnCxzFjHBU1vR3qz37oQH0n0GIswVXEXdZJKuXmZQ3EAFN2sJ1M8dqO";
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                };

                const requestBody = JSON.stringify({
                    "Name": name,
                    "Expense_Amount__c": amount
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
            e.preventDefault();
            const name = document.getElementById("expense-name").value;
            const amount = parseFloat(document.getElementById("expense-amount").value);

            if (name && amount) {
                expenses.push({ name, amount });
                totalExpense += amount;
                await addExpenseToSalesforce(name, amount); // Add the expense to Salesforce
                updateUI();
                expenseForm.reset();
                toggleExpenseListVisibility();
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