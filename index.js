const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

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
    })
  })
})

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); //preventing form submit
    forms.classList.toggle("show-signup");
  });
});

let globalUsername = '';
let globalPassword = '';

// Event listener for username input change
document.getElementById('usernameInput').addEventListener('input', function(event) {
    globalUsername = event.target.value;
    console.log('Username:', globalUsername);
});

// Event listener for password input change
document.getElementById('passwordInput').addEventListener('input', function(event) {
    globalPassword = event.target.value;
    console.log('Password:', globalPassword);
});

export { globalUsername, globalPassword};