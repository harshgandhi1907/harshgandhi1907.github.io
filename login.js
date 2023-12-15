const forms = document.querySelector(".forms"),
pwShowHide = document.querySelectorAll(".eye-icon"),
links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    
    pwFields.forEach(password => {
        if(password.type === "password"){
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
<<<<<<< HEAD
link.addEventListener("click", e => {
 e.preventDefault(); //preventing form submit
 forms.classList.toggle("show-signup");
})
})
=======
  link.addEventListener("click", e => {
    e.preventDefault(); //preventing form submit
    forms.classList.toggle("show-signup");
  })
})


>>>>>>> f0be7e8f1505e39cb83be1a1080c3b077f75a607
