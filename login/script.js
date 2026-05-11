const bgLoader = document.getElementById("bg-loader");

if (bgLoader) {
  const bgImage = new Image();
  bgImage.src = "blue-background.png";

  const ocultarLoader = () => {
    bgLoader.classList.add("oculto");
    setTimeout(() => {
      bgLoader.remove();
    }, 400);
  };

  bgImage.addEventListener("load", ocultarLoader);
  bgImage.addEventListener("error", ocultarLoader);
}

let login = document.getElementById("login");
let revelado = false;

const olho = document.querySelector(".eye");

const toggleSenha = () => {
  const senhaInput = document.getElementById("senhaInput");
  olho.classList.add("animando");
  setTimeout(() => {
    revelado = !revelado;
    senhaInput.type = revelado ? "text" : "password";
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

login.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const senha = document.getElementById("senhaInput").value;
  const usuario = findUser(email, senha);

  if (usuario) {
    window.location.href = "../dashboard/index.html";
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Erro ao entrar",
      text: "Email ou senha incorretos.",
      width: "400px",
      allowOutsideClick: true,
      allowEscapeKey: true,

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
});

