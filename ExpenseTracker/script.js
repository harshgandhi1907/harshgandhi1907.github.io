document.addEventListener("DOMContentLoaded", () => {
    try {
        const expenseForm = document.getElementById("expense-form");
        const expenseList = document.getElementById("expense-list");
        const balance = document.getElementById("balance");
        const expensesContainer = document.getElementById("expenses-container");

        let expenses = [];
        let totalExpense = 0;

        expenseForm.addEventListener("submit", (e) => {
            try {
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

                    // Rest API callout
                    var data = {
                        Name: (Math.random()).toString(),
                        Expense_Name__c: name,
                        Expense_Amount__c: amount
                    };
                    // consumer key = 3MVG9pRzvMkjMb6naRM353RGyfO_sA0RSipQL3qs0I8rba2pDr1arq8GaEy5PnjyOvuR8Vkz1MYORLHlYfs6s
                    // consumer secret =  460ADD94008F060A4F3E58FBCE32EC0122A3929E335D703E7FBF72AE5A3E4215
                    var access_token = '6Cel800D5j00000CfpEr8885j000000hFF1sx4PcANYC4BmtyMxqoaGR5lMuVoE7QhIRYMleURFncbZPYUrDYuwRNtGdRIpQykOd4hj7V0O';
                    if(access_token != ''){
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', 'https://harsh-2b-dev-ed.develop.lightning.force.com/services/data/v58.0/sobjects/Expense__c/', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
                        
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                console.log('Data stored successfully');
                            } else {
                                console.error('Error storing data');
                            }
                        };
                        console.log(xhr);
                        
                        xhr.send(JSON.stringify(data));
                        toggleExpenseListVisibility();
                    } else{
                        alert('Something went wrong !! Please try again');
                    }
                }
            } catch (error) {
                console.log('error in submit click ==> ' + error);
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