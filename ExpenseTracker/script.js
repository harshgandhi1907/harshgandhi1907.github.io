document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const balance = document.getElementById("balance");
    const expensesContainer = document.getElementById("expenses-container");


    let expenses = [];
    let totalExpense = 0;

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(
            document.getElementById("expense-amount").value
        );

        if (name && amount) {
            expenses.push({ name, amount });
            totalExpense += amount;
            updateUI();
            expenseForm.reset();
            toggleExpenseListVisibility();
        }
    });

    // Function to toggle visibility of the expense list based on expense addition
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