const fetch = require('node-fetch');

const salesforceEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Expense__c";
const salesforceQueryEndpoint = "https://expensetrackerportal-dev-ed.my.salesforce.com/services/data/v58.0/query/";

const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your Salesforce access token

async function addExpenseToSalesforce(name, amount) {
    try {
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

async function fetchExpensesFromSalesforce(username, password) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const query = `SELECT Name, Expense_Amount__c FROM Expense__c WHERE User_Name__c = '${username}' AND Password__c ='${password}'`;

        const response = await fetch(salesforceQueryEndpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({ query }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Expenses fetched from Salesforce:", data);
            // Process the fetched data here
        } else {
            console.log("Failed to fetch expenses from Salesforce:", response.statusText);
        }
    } catch (error) {
        console.log("Error fetching expenses from Salesforce:", error);
    }
}

module.exports = {
    addExpenseToSalesforce,
    fetchExpensesFromSalesforce
};