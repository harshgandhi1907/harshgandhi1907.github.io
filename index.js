document.addEventListener("DOMContentLoaded", async (e) => {
    const accessToken = '00D5h0000093stB!ARMAQB2jIJeAbrBjhcXIjl5OF1MbUgSA4v61Mh9y6mRroOGGiwuVdSQGnM33FXF2KgTpGVNdECXh9aqFpFv1fGboNP_246iC';
    try {
        console.log('onload login page');
        let globalUsername = '';
        let globalPassword = '';

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
        document.getElementById('usernameInput').addEventListener('input', function (event) {
            globalUsername = event.target.value;
            console.log('Username:', globalUsername);
        });

        // Event listener for password input change
        document.getElementById('passwordInput').addEventListener('input', function (event) {
            globalPassword = event.target.value;
            console.log('Password:', globalPassword);
        });

        // Login onclick
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", async (e) => {
            try {
                console.log('onclick login');
                e.preventDefault();
                var username = document.getElementById("usernameInput").value;
                var password = document.getElementById("passwordInput").value;
                if (username == "" || password == "") {
                    alert("Please fill in all fields.");
                }
                if (username && password) {
                    // check if account is already present
                    const sfCheckAccEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Id,+Password__c+FROM+Account+WHERE+UserName__c+=+%27' + username + '%27';
                    console.log(sfCheckAccEndpoint);
                    const response = await fetch(sfCheckAccEndpoint, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    console.log(response);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        if(data.records.length != 0){
                            const url = data.records[0].Id;
                            var actualPass = data.records[0].Password__c;
                            if(actualPass === password){   
                                localStorage.setItem('accId', url);
                                localStorage.setItem('username', username);
                                localStorage.setItem('password', password);
                                window.location.href = 'https://harshgandhi1907.github.io/home.html';
                            } else{
                                alert('Incorrect Password');
                            }
                        } else{
                            username = '';
                            password = '';
                            alert('Account not found !! Please Check credentials or Create new Account');
                        }
                    } else {
                        console.log('Failed to fetch data from Salesforce:', response.statusText);
                    }
                } else {
                    alert('something went wrong !! Login failed');
                }
            } catch (error) {
                console.log('error in submit action ==> ' + error);
            }
        });
    } catch (error) {
        console.log('error in DOMContentLoaded login ==> ' + error);
    }
});