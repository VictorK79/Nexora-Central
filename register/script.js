const bgLoader = document.getElementById("bg-loader");

if (bgLoader) {
  const bgImage = new Image();
  bgImage.src = "abstract wave.png";

  const ocultarLoader = () => {
    bgLoader.classList.add("oculto");
    setTimeout(() => {
      bgLoader.remove();
    }, 400);
  };

  bgImage.addEventListener("load", ocultarLoader);
  bgImage.addEventListener("error", ocultarLoader);
}

let olhos = document.getElementsByClassName("eye");

for (let olho of olhos) {
  const toggleSenha = () => {
    let input = olho.parentElement.querySelector("input");
    olho.classList.add("animando");
    setTimeout(() => {
      input.type = input.type === "password" ? "text" : "password";
      olho.classList.toggle("fa-eye");
      olho.classList.toggle("fa-eye-slash");
      olho.classList.remove("animando");
    }, 50);
  };

  olho.addEventListener("click", toggleSenha);

  olho.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSenha();
    }
  });
}

function mostrarErro(titulo, texto) {
  Swal.fire({
    position: "center",
    icon: "error",
    title: titulo,
    text: texto,
    width: "400px",
    allowOutsideClick: true,
    allowEscapeKey: false,

    customClass: {
      popup: "meu-swal-popup",
      title: "meu-swal-title",
      htmlContainer: "meu-swal-text",
      icon: "meu-swal-icon",
      confirmButton: "meu-swal-button",
    },

    background: "rgba(0, 0, 60, 0.75)",
    color: "#ffffff",
    confirmButtonText: "Entendi",
    confirmButtonColor: "#132cad",
    backdrop: "rgba(0, 0, 0, 0.45)",
  });
}
function validarSenhas() {
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmar").value;
  const estadoSenha = document.getElementById("statePassword");

  if (!senha || !confirmar) {
    estadoSenha.style.color = "#ffffff";
    estadoSenha.textContent = "Digite a senha nos dois campos.";
    return;
  }

  if (senha !== confirmar) {
    estadoSenha.style.color = "red";
    estadoSenha.textContent = "As senhas não coincidem.";
    return;
  }

  estadoSenha.style.color = "green";
  estadoSenha.textContent = "As senhas coincidem.";
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
    mostrarErro(
      "Campos obrigatórios",
      "Preencha todos os campos antes de continuar.",
    );
    return
  }

  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;

  if (!emailRegex.test(email)) {
    mostrarErro("Email inválido", "Por favor, insira um email válido.");
    return;
  }

  if (senha.length < 8) {
    mostrarErro("Senha fraca", "A senha deve ter pelo menos 8 caracteres.");
    return;
  }

  if (senha !== confirmar) {
    mostrarErro("Senhas diferentes", "As senhas não coincidem.");
    return;
  }

  if (!termos) {
    mostrarErro(
      "Termos obrigatórios",
      "Você deve aceitar os termos e condições.",
    );
    return;
  }

  const usuariosExistentes = getUsers();

  const emailJaExiste = usuariosExistentes.some((u) => u.email === email);

  if (emailJaExiste) {
    mostrarErro("Email já cadastrado", "Este email já está cadastrado.");
    return;
  }

  const novoUsuario = {
    nome,
    sobrenome,
    email,
    endereco,
    bairro,
    numero,
    senha,
  };

  const btnRegistre = document.getElementById("registre");
  btnRegistre.disabled = true;
  btnRegistre.textContent = "Registrando...";

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
      icon: "meu-swal-icon",
    },

    background: "rgba(0, 0, 60, 0.75)",
    color: "#ffffff",
    backdrop: `
    rgba(0, 0, 0, 0.45)
    backdrop-filter: blur(4px)
  `,
  });

  setTimeout(() => {
    window.location.href = "../login/index.html";
  }, 2300);
});
const senhaInput = document.getElementById("senha");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

senhaInput.addEventListener("input", () => {
  const senha = senhaInput.value;
  let forca = 0;

  if (senha.length >= 8) forca++;
  if (/[A-Z]/.test(senha)) forca++;
  if (/[0-9]/.test(senha)) forca++;
  if (/[^A-Za-z0-9]/.test(senha)) forca++;

  if (!senha) {
    strengthBar.style.width = "0%";
    strengthText.textContent = "";
    return;
  }

  if (forca <= 1) {
    strengthBar.style.width = "33%";
    strengthBar.style.background = "#ff6b6b";
    strengthText.style.color = "#ff6b6b";
    strengthText.textContent = "Senha fraca";
  } else if (forca <= 3) {
    strengthBar.style.width = "66%";
    strengthBar.style.background = "#facc15";
    strengthText.style.color = "#facc15";
    strengthText.textContent = "Senha média";
  } else {
    strengthBar.style.width = "100%";
    strengthBar.style.background = "#4ade80";
    strengthText.style.color = "#4ade80";
    strengthText.textContent = "Senha forte";
  }
});
