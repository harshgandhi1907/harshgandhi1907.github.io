document.addEventListener("DOMContentLoaded", async (e) => {
    const accessToken = '00D5h0000093stB!ARMAQFgZF58xJZWPL6yzapqcEepj4jLCOjSbByFSrnIcokw8OgghCsCNjsbhAoMjYoMDPEvphklZWoT0EDrjl5wRr2OSnyjD';
    try {
        const forgotPassForm = document.getElementById("forgotPassForm");
        forgotPassForm.addEventListener("submit", async (e) => {
        try {
            console.log('onclick login');
            e.preventDefault();
            var unameInput = document.getElementById("unameInput").value;
            var passInput = document.getElementById("passInput").value;
            var confPassInput = document.getElementById("confPassInput").value;
            if (unameInput == "" || passInput == "" || confPassInput == "") {
                alert("Please fill in all fields.");
            }
            if (unameInput && passInput && confPassInput) {
                const sfCheckAccEndpoint = 'https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/query?q=SELECT+Id+FROM+Account+WHERE+UserName__c+=+%27' + unameInput + '%27';
                console.log(sfCheckAccEndpoint);
                const response = await fetch(sfCheckAccEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                // If entered username account is present
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    const accId = data.records[0].Id;
                    const salesforceEndpoint = `https://expensetrackerportal-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/Account/${accId}`;
                    const headers2 = {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    };
                    const requestBody2 = JSON.stringify({
                        "Password__c":passInput
                    });
                    const response2 = await fetch(salesforceEndpoint, {
                        method: "PATCH",
                        headers2,
                        body: requestBody2
                    });
                    if (response2.ok) {
                        const data2 = await response2.json();
                        console.log(data2);
                        alert('Password changed successfully !!!')
                        window.location.href = 'https://harshgandhi1907.github.io/index.html';
                    } else{
                        unameInput.innerHTML = '';
                        passInput.innerHTML = '';
                        confPassInput.innerHTML = '';
                        alert('Please try again');
                    }
                } else {
                    unameInput.innerHTML = '';
                    passInput.innerHTML = '';
                    confPassInput.innerHTML = '';
                    alert('Account with entered username is not found');
                    console.log('Failed to fetch data from Salesforce:', response.statusText);
                }
            }
        } catch (error) {
            console.log('error in submit action ==> '+ error);
        }
        });
    } catch (error) {
        console.log('error in DOMContentLoaded home ==> ' + error);
        console.log('Line number ==> ' + error.lineNumber);
    }
});