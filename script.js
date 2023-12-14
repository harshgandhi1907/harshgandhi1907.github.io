document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const balance = document.getElementById("balance");
    const expensesContainer = document.getElementById("expenses-container");

    let expenses = [];
    let totalExpense = 0;

    async function addExpenseToSalesforce(name, amount) {
        const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.lightning.force.com/services/data/v58.0/sobjects/Expense__c";
        const accessToken = "6Cel800D5h0000093stB8885h000000Oynw40RJran3Jypf7lPD8tLGLiNMmrXO3Rc7uXNCExve1P2AO1x8fJiYYVAz6Y4NYLdaIZf3zIbI";

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const requestBody = JSON.stringify({
            "Name": name,
            "Expense_Amount__c": amount
        });

        try {
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

    function addExpense() {
        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);

        if (name && amount) {
            expenses.push({ name, amount });
            totalExpense += amount;

            addExpenseToSalesforce(name, amount); // Add the expense to Salesforce

            updateUI();
            expenseForm.reset();
            toggleExpenseListVisibility();
        }
    }

    function toggleExpenseListVisibility() {
        expensesContainer.style.display = expenses.length > 0 ? "block" : "none";
    }

    function updateUI() {
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
    }

    window.removeExpense = (index) => {
        const removedExpense = expenses.splice(index, 1)[0];
        totalExpense -= removedExpense.amount;
        updateUI();
        toggleExpenseListVisibility();
    };
});
