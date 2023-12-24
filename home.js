const accessToken = '00D5h0000093stB!ARMAQPpJiqObiREi7aVBktGsas0tEX8nMA2GHeOyecokccdjZJHA6T3.G_hdhHbZWl4m2yjDsi6XoD3oKPAW1Tazx0yc3t3L';
let totalExpense = 0;
document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        console.log('onload home');
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        const accId = localStorage.getItem('accId');
        console.log(accId);
        if (storedUsername != '' && storedPassword != '') {
            let expenses = [];
            toggleExpenseListVisibility(expenses);
            // Get previous expense data if present
            const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Expense_Name__c,+Expense_Amount__c,+Id,+Expense_Date__c+FROM+Expense__c+WHERE+Name+=+%27' + storedUsername + '%27';
            const response1 = await fetch(salesforceQEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response1);
            if (response1.ok) {
                const data = await response1.json();
                console.log(data);
                data.records.forEach(record => {
                    const expenseName = record.Expense_Name__c;
                    const expenseAmount = parseFloat(record.Expense_Amount__c);
                    const expenseDate = record.Expense_Date__c;
                    const sfId = record.Id;
                    console.log(`Id: ${sfId}, Name: ${expenseName}, Amount: ${expenseAmount}, Date: ${expenseDate}`);
                    expenses.push({Id: sfId, name: expenseName, amount: expenseAmount, date: expenseDate });

                    // Calculate total expense
                    totalExpense += expenseAmount;
                    const balance = document.getElementById("balance");
                    balance.innerText = totalExpense;
                });

                // Create a li element for each expense
                const expenseList = document.getElementById("expense-list");
                expenseList.innerHTML = "";
                expenses.forEach((expense) => {
                    const listItem = document.createElement("li");
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = 'Delete';
                    deleteButton.setAttribute('onclick', `removeExpense('${expense.Id}')`);
                    deleteButton.setAttribute('data-record-id', expense.Id);
                    listItem.innerHTML = `
                        <span>${expense.date}</span>
                        <span>${expense.name}</span>
                        <span>₹${expense.amount}</span>
                    `;
                    listItem.appendChild(deleteButton);
                    expenseList.appendChild(listItem);
                });

                toggleExpenseListVisibility(expenses);
            } else {
                console.log('Failed to fetch data from Salesforce:', response1.statusText);
            }

            // Get budget if present
            const getBUdget = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Budget_Amount__c,+Id+FROM+Budget__c+WHERE+Name+=+%27' + storedUsername + '%27';
            const response2 = await fetch(getBUdget, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if(response2.ok){
                const data = await response2.json();
                console.log(data);
                if(data.records.length != 0){
                    data.records.forEach(record => {
                        var budget = record.Budget_Amount__c;
                        var budgetId = record.Id;
                        const newbudget = document.getElementById("totalBudget");
                        newbudget.placeholder = "Edit Budget";
                        newbudget.innerText = budget;
                        localStorage.setItem("budget" , budget);
                        localStorage.setItem("budgetId" , budgetId);
                    })
                } else{
                    localStorage.setItem("budget" , '');
                }
            } else{
                console.log('error in budget callout');
                localStorage.setItem("budget" , '');
            }

            // Add expense onclick
            var expenseForm = document.getElementById("expense-form");
            expenseForm.addEventListener("submit", async (e) => {
                try {
                    console.log('onclick submit');
                    e.preventDefault();
                    var name = document.getElementById("expense-name").value;
                    var amount = parseFloat(document.getElementById("expense-amount").value);
                    var date = document.getElementById("expense-date").value;  
                    var uname = localStorage.getItem('username');
                    var pass = localStorage.getItem('password');
                    if (name && amount && accId != '') {
                        // add Expense To Salesforce
                        console.log(date);
                        addExpenseToSalesforce(name, amount, date, uname, pass, accId, expenses);
                    } else {
                        alert('something went wrong !! Record not stored')
                    }
                } catch (error) {
                    console.log('error in submit action ==> ' + error);
                    console.log('Line number ==> ' + error.lineNumber);
                }
            });

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

            window.removeExpense = async (recordId) => {
                try {
                    console.log('remove meth');
                    var sfRecDeleteEndpoint = `https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c/${recordId}`;
                    var response3 = await fetch(sfRecDeleteEndpoint, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                    });
                    if (response3.ok) {
                        console.log(response3);
                        console.log('Record deleted successfully!');
                        const expenseListItem = document.querySelector(`li button[data-record-id="${recordId}"]`).parentNode;
                        const removedExpenseAmount = parseFloat(expenseListItem.querySelector('span:nth-child(2)').textContent.slice(1));
                        expenseListItem.remove();
                        totalExpense -= removedExpenseAmount;
                        const balance = document.getElementById("balance");
                        balance.innerText = totalExpense;
                        toggleExpenseListVisibility(expenses);
                        location.reload();
                    } else {
                        console.error('Failed to delete record:', response.statusText);
                        // Handle error cases or display an error message
                    }
                } catch (error) {
                    console.log('error in removeExpnese ==> ' + error);
                    console.log('Line number ==> ' + error.lineNumber);
                }
            };

            async function addExpenseToSalesforce(name, amount, date, uname, pass, accId, expenses) {
                try {
                    console.log('add expense callout meth');
                    const sfExpAddEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";
                    var headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    };
                    var requestBody = JSON.stringify({
                        "Expense_Name__c": name,
                        "Expense_Amount__c": amount,
                        "Expense_Date__c": date,
                        "Name": uname,
                        "Password__c": pass,
                        "Account__c": accId
                        // Add other fields as needed for your Expense object
                    });
                    var response = await fetch(sfExpAddEndpoint, {
                        method: "POST",
                        headers,
                        body: requestBody,
                    });
                    if (response.ok) {
                        console.log(response);
                        console.log("Expense added to Salesforce!");
                        var expenseForm = document.getElementById("expense-form");
                        const data = await response.json();
                        console.log(data);

                        expenses.push({Id: data.id, name: name, amount: amount, date: date });
                        // Create a li for the new expense
                        const expenseList = document.getElementById("expense-list");
                        const listItem = document.createElement("li");
                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = 'Delete';
                        deleteButton.setAttribute('onclick', `removeExpense('${data.id}')`);
                        deleteButton.setAttribute('data-record-id', data.Id);
                        listItem.innerHTML = `
                            <span>${date}</span>
                            <span>${name}</span>
                            <span>₹${amount}</span>
                        `;
                        listItem.appendChild(deleteButton);
                        expenseList.appendChild(listItem);
                        totalExpense += amount;
                        const balance = document.getElementById("balance");
                        balance.innerText = totalExpense;
                        toggleExpenseListVisibility(expenses);
                        location.reload();
                    } else {
                        console.log("Failed to add expense to Salesforce:", response.statusText);
                    }
                } catch (error) {
                    console.log("Error adding expense to Salesforce:", error);
                }
            }

            var budgetForm = document.getElementById("budget-form");
            budgetForm.addEventListener("submit", async (e) => {
                try {
                    console.log('createBudget method');
                    e.preventDefault();
                    const uname = localStorage.getItem('username');
                    const storedBudget = localStorage.getItem('budget');
                    var newbudgetAmount = document.getElementById("budget-line").value;

                    if(storedBudget != ''){
                        // Edit budget if already setted
                        var budgetId = localStorage.getItem("budgetId");
                        const updateBudgetSF = `https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Budget__c/${budgetId}`;
                        var headers2 = {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        };
                        var requestBody2 = JSON.stringify({
                            "Budget_Amount__c": newbudgetAmount
                        });
                        var response6 = await fetch(updateBudgetSF, {
                            method: "PATCH",
                            headers2,
                            body: requestBody2
                        });
                        if(response6.ok){
                            const data = await response6.json();
                            console.log(data);
                            const editedBudget = document.getElementById("totalBudget");
                            editedBudget.placeholder = "Edit budget";
                            editedBudget.innerText = newbudgetAmount;
                        }
                    } 
                    if(storedBudget === ''){
                        // create budget
                        const setBudgetSF = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Budget__c";
                        const headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        };
                        const requestBody = JSON.stringify({
                            "Name": uname,
                            "Budget_Amount__c": newbudgetAmount,
                        });
                        const response5 = await fetch(setBudgetSF, {
                            method: "POST",
                            headers,
                            body: requestBody,
                        });
                        if(response5.ok){
                            console.log(response5);
                            console.log("Budget added to Salesforce!");
                            const newbudget = document.getElementById("totalBudget");
                            newbudget.placeholder = "Edit budget";
                            newbudget.innerText = newbudgetAmount;
                        }
                    }
                } catch (error) {
                    console.log('onclick error for createBudget : ' + error);
                }
            });
        } else {
            console.log('login credentials not fetched');
        }
    } catch (error) {
        console.log('error in DOMContentLoaded home ==> ' + error);
        console.log('Line number ==> ' + error.lineNumber);
    }
});

async function deleteAcc(){
    var accId = localStorage.getItem('accId');
    const confirmation = window.confirm('Are you sure you want to delete the account?');
    if(confirmation){
        const sfDeleteEndpoint = `https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Account/${accId}`;
        const response = await fetch(sfDeleteEndpoint, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
        });
        if (response.ok) {
            console.log(response);
            console.log('Record deleted successfully!');
            alert('Account Deleted successfully !!');
            window.location.href = 'https://harshgandhi1907.github.io/index.html';
            // Perform any additional actions upon successful deletion
        } else {
            console.error('Failed to delete record:', response.statusText);
            // Handle error cases or display an error message
        }
    }
}