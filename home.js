const accessToken = '00D5h0000093stB!ARMAQGsAAsXlRwsgHgh8zEHJ6.mHUL1FQubxja50UkvyL7a2V4HRbd8cHsqwJMXoq2rlF7w6gYLA0FRc_sN6Fdi2mXJHAl2X';
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
            // Get previous data if present
            // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27';
            // const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name+FROM+Expense__c+WHERE+User_Name__c+=+%27harsh1907%27+Password__c+=+%27harsh1907%27';
            const salesforceQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Name,+Expense_Amount__c,+Id+FROM+Expense__c+WHERE+User_Name__c+=+%27' + storedUsername + '%27';
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
                data.records.forEach(record => {
                    const expenseName = record.Name;
                    const expenseAmount = parseFloat(record.Expense_Amount__c);
                    const sfId = record.Id;
                    console.log(`Id: ${sfId}, Name: ${expenseName}, Expense Amount: ${expenseAmount}`);
                    expenses.push({Id: sfId, name: expenseName, amount: expenseAmount });

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
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = 'Delete';
                    deleteButton.setAttribute('onclick', `removeExpense('${expense.Id}')`);
                    deleteButton.setAttribute('data-record-id', expense.Id);
                    listItem.innerHTML = `
                        <span>${expense.name}</span>
                        <span>₹${expense.amount}</span>
                    `;
                    listItem.appendChild(deleteButton);
                    expenseList.appendChild(listItem);
                });

                toggleExpenseListVisibility(expenses);
            } else {
                console.log('Failed to fetch data from Salesforce:', response.statusText);
            }

            // Add expense onclick
            var expenseForm = document.getElementById("expense-form");
            expenseForm.addEventListener("submit", async (e) => {
                try {
                    console.log('onclick submit');
                    e.preventDefault();
                    var name = document.getElementById("expense-name").value;
                    var amount = parseFloat(document.getElementById("expense-amount").value);
                    var uname = localStorage.getItem('username');
                    var pass = localStorage.getItem('password');
                    if (name && amount && accId != '') {
                        // add Expense To Salesforce
                        addExpenseToSalesforce(name, amount, uname, pass, accId, expenses);
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
                    const sfRecDeleteEndpoint = `https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c/${recordId}`;
                    const response3 = await fetch(sfRecDeleteEndpoint, {
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

            async function addExpenseToSalesforce(name, amount, uname, pass, accId, expenses) {
                try {
                    console.log('add expense callout meth');
                    const sfExpAddEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    };
                    const requestBody = JSON.stringify({
                        "Name": name,
                        "Expense_Amount__c": amount,
                        "User_Name__c": uname,
                        "Password__c": pass,
                        "Account__c": accId
                        // Add other fields as needed for your Expense object
                    });
                    const response = await fetch(sfExpAddEndpoint, {
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

                        expenses.push({Id: data.id, name: name, amount: amount });
                        // Create a li for the new expense
                        const expenseList = document.getElementById("expense-list");
                        const listItem = document.createElement("li");
                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = 'Delete';
                        deleteButton.setAttribute('onclick', `removeExpense('${data.id}')`);
                        deleteButton.setAttribute('data-record-id', data.Id);
                        listItem.innerHTML = `
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