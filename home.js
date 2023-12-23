const accessToken = '00D5h0000093stB!ARMAQGsAAsXlRwsgHgh8zEHJ6.mHUL1FQubxja50UkvyL7a2V4HRbd8cHsqwJMXoq2rlF7w6gYLA0FRc_sN6Fdi2mXJHAl2X';
document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        console.log('onload home');
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        const accId = localStorage.getItem('accId');
        console.log(accId);
        let totalExpense = 0;
        if (storedUsername != '' && storedPassword != '') {
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
                    let expenses = [];
                    if (name && amount && accId != '') {
                        expenses.push({ name: name, amount: amount });
                        totalExpense += amount;

                        // add Expense To Salesforce
                        addExpenseToSalesforce(name, amount, uname, pass, accId);
                        
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

            async function addExpenseToSalesforce(name, amount, uname, pass, accId) {
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
                        const expenseCont = document.getElementsByClassName("main-container");
                        const data = await response.json();
                        console.log(data);
                        expenseCont.reset();
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