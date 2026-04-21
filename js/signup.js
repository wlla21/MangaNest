const form = document.getElementById("signup-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (name && email && password) {
    localStorage.setItem("username", name);
    localStorage.setItem("useremail", email);
    localStorage.setItem("password", password);
    window.location.href = "login.html";
  } else {
    alert("Please fill all fields");
  }
});
