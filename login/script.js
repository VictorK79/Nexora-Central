let login = document.getElementById("login");
let checkPassword = document.getElementById('checkRevealPassword')
let body = document.body
let revelado = false;

login.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").querySelector("input").value;
  const senha = document.getElementById("senha").querySelector("input").value;
  if (emailsVerificados.includes(email) && senhasVerificados.includes(senha)) {
    window.location.href = "../register/index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
});
checkPassword.addEventListener('click', () => {
    let senhaInput = document.getElementById('senha').querySelector('input')
    revelado = !revelado
    if (revelado) {
        senhaInput.type = 'text'
    } else {
        senhaInput.type = 'password'
    }
})
