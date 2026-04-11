const loginForm = document.getElementById("loginForm");
const useremail = localStorage.getItem("useremail");
const userpassword = localStorage.getItem("password");
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (useremail == email && userpassword == password) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html";
  } else {
    alert("Wrong email and password");
  }
});
