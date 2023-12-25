document.addEventListener("DOMContentLoaded", async (e) => {
    const accessToken = '00D5h0000093stB!ARMAQB2jIJeAbrBjhcXIjl5OF1MbUgSA4v61Mh9y6mRroOGGiwuVdSQGnM33FXF2KgTpGVNdECXh9aqFpFv1fGboNP_246iC';
    try {
        console.log('onload signup');
        // Show/Hide password action
        const pwShowHide = document.querySelectorAll(".eye-icon")
        pwShowHide.forEach(eyeIcon => {
            eyeIcon.addEventListener("click", () => {
                let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
                pwFields.forEach(password => {
                    if (password.type === "password") {
                        password.type = "text";
                        eyeIcon.classList.replace("bx-hide", "bx-show");
                        return;
                    }
                    password.type = "password";
                    eyeIcon.classList.replace("bx-show", "bx-hide");
                });
            });
        });

        // Event listener for username input change
        document.getElementById('usernameinput').addEventListener('input', function (event) {
            signedUsername = event.target.value;
            console.log('Signed Username:', signedUsername);
            localStorage.setItem('signedUsername', signedUsername);
        });

        // Event listener for password input change
        document.getElementById('passwordinput').addEventListener('input', function (event) {
            signedPassword = event.target.value;
            console.log('Signed Password:', signedPassword);
            localStorage.setItem('signedPassword', signedPassword);
        });

        // signup onclick
        const accountForm = document.getElementById("accountForm");
        accountForm.addEventListener("submit", async (e) => {
            try {
                console.log('onclick signup');
                
                const newUname = document.getElementById('usernameinput').value;
                const newPass = document.getElementById('passwordinput').value;
                const newEmail = document.getElementById('emailinput').value;
                const confirmPassword = document.getElementById('confirmpasswordinput').value;

                if (newUname == "" || newPass == "" || newEmail == "" || confirmPassword == "") {
                    alert("Please fill in all fields.");
                }
                if(confirmPassword !== newPass){
                    alert('Confirm password should match the actual-one !!');
                }
                if (newUname && newPass && newEmail) {
                    // check if same username already exist
                    const sfCheckQEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Id+FROM+Account+WHERE+UserName__c+=+%27' + newUname + '%27';
                    console.log(sfCheckQEndpoint);
                    const response = await fetch(sfCheckQEndpoint, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    console.log(response);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        if(data.records.length == 0){
                            // Create Account
                            createAccountToSalesforce(newUname, newPass, newEmail);
                        } else{
                            newUname = '';
                            newPass = '';
                            newEmail = '';
                            confirmPassword = '';
                            alert('Account with same username already exist !! \nUse different username');
                        }
                    } else {
                        console.error('Failed to fetch data from Salesforce:', response.statusText);
                    }
                } else {
                    alert('something went wrong !! account not created');
                }
            } catch (error) {
                console.log('error in submit action ==> ' + error);
            }
        });

        async function createAccountToSalesforce(newUname, newPass, newEmail) {
            try {
                console.log('create account callout meth');
                const salesforceAccEndpoint = "https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Account";
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                };
                const requestBody = JSON.stringify({
                    "Name": newUname,
                    "Email__c": newEmail,
                    "UserName__c": newUname,
                    "Password__c": newPass
                    // Add other fields as needed for your Expense object
                });
                const response = await fetch(salesforceAccEndpoint, {
                    method: "POST",
                    headers,
                    body: requestBody,
                });
                if (response.ok) {
                    console.log("Account created to Salesforce!");
                    console.log(response);
                    const data = await response.json();
                    console.log(data);
                    const url = data.id;
                    localStorage.setItem('accId', url);
                    // go to login
                    window.location.href = "https://harshgandhi1907.github.io/index.html";
                } else {
                    console.log("Failed to create account to Salesforce:", response.statusText);
                    // show error
                }
            } catch (error) {
                console.log("Error creating account to Salesforce:", error);
            }
        }
    } catch(error){
        console.log('error in DOMContentLoaded signup ==> ' + error);
    }
});