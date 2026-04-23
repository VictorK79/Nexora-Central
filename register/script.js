let olhos = document.getElementsByClassName("eye");

for (let olho of olhos) {
  olho.addEventListener("click", () => {
    let input = olho.parentElement.querySelector("input");
    olho.classList.add("animando");
    setTimeout(() => {
      input.type = input.type === "password" ? "text" : "password";
      olho.classList.toggle("fa-eye");
      olho.classList.toggle("fa-eye-slash");
      olho.classList.remove("animando");
    }, 50);
  });
}

let password = document.getElementById("password");

function validarSenhas() {
  let senha = document.getElementById("senha").value;
  let confirmar = document.getElementById("confirmar").value;
  let estadoSenha = document.getElementById("statePassword");
  if (senha === "" || confirmar === "") {
    estadoSenha.style.color = "white";
    estadoSenha.textContent = "Escreva sua senha nos dois quadros.";
    return;
  } else {
    if (senha !== confirmar) {
      estadoSenha.style.color = "red";
      estadoSenha.innerText = "As senhas não coincidem. Insira-os novamente.";
    } else {
      estadoSenha.style.color = "green";
      estadoSenha.innerHTML = "As senhas se coincidem.";
    }
  }
}

document.getElementById("senha").addEventListener("input", validarSenhas);
document.getElementById("confirmar").addEventListener("input", validarSenhas);

const formRegister = document.getElementById("register");

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sobrenome = document.getElementById("sobrenome").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmar").value;
  const termos = document.getElementById("termos").checked;

  if (
    !nome ||
    !sobrenome ||
    !email ||
    !endereco ||
    !bairro ||
    !numero ||
    !senha ||
    !confirmar
  ) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;

  if (!emailRegex.test(email)) {
    alert("Por favor, insira um email válido!");
    return;
  }

  if (senha.length < 8) {
    alert("A senha deve ter pelo menos 8 caracteres!");
    return;
  }

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  if (!termos) {
    alert("Você deve aceitar os termos e condições!");
    return;
  }

  const usuariosExistentes = getUsers();

  const emailJaExiste = usuariosExistentes.some((u) => u.email === email);

  if (emailJaExiste) {
    alert("Este email já está cadastrado!");
    return;
  }

  const novoUsuario = {
    nome,
    sobrenome,
    email,
    endereco,
    bairro,
    numero,
    password: senha,
  };

  saveUser(novoUsuario);

  Swal.fire({
  position: "center",
  icon: "success",
  title: "Usuário registrado com sucesso!",
  text: "Redirecionando para login...",
  showConfirmButton: false,
  timer: 2000,
  width: "400px",
  allowOutsideClick: false,
  allowEscapeKey: false,

  customClass: {
    popup: "meu-swal-popup",
    title: "meu-swal-title",
    htmlContainer: "meu-swal-text",
    icon: "meu-swal-icon"
  },

  background: "rgba(0, 0, 60, 0.75)",
  color: "#ffffff",
  backdrop: `
    rgba(0, 0, 0, 0.45)
    backdrop-filter: blur(4px)
  `
}); 

  setTimeout(() => {
    window.location.href = "../login/index.html";
  }, 2300);
});