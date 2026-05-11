const bgLoader = document.getElementById("bg-loader");

if (bgLoader) {
  const bgImage = new Image();
  bgImage.src = "../login/blue-background.png";

  const ocultarLoader = () => {
    bgLoader.classList.add("oculto");
    setTimeout(() => {
      bgLoader.remove();
    }, 400);
  };

  bgImage.addEventListener("load", ocultarLoader);
  bgImage.addEventListener("error", ocultarLoader);
}

const form = document.getElementById("forgot-box");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;

  if (!email) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Campo obrigatório",
      text: "Por favor, informe o seu e-mail.",
      width: "400px",
      confirmButtonText: "Entendi",
      customClass: {
        popup: "meu-swal-popup",
        width: "200px",
        title: "meu-swal-title",
        htmlContainer: "meu-swal-text",
        icon: "meu-swal-icon",
        confirmButton: "meu-swal-button",
      },
      background: "rgba(0, 0, 60, 0.75)",
      color: "#ffffff",
      backdrop: "rgba(0, 0, 0, 0.45)",
    });
    return;
  }

  if (!emailRegex.test(email)) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "E-mail inválido",
      text: "Por favor, insira um e-mail válido.",
      width: "400px",
      confirmButtonText: "Entendi",
      customClass: {
        popup: "meu-swal-popup",
        title: "meu-swal-title",
        htmlContainer: "meu-swal-text",
        icon: "meu-swal-icon",
        confirmButton: "meu-swal-button",
      },
      background: "rgba(0, 0, 60, 0.75)",
      color: "#ffffff",
      backdrop: "rgba(0, 0, 0, 0.45)",
    });
    return;
  }

  const usuarios = getUsers();
  const usuarioExiste = usuarios.some((u) => u.email === email);

  if (!usuarioExiste) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "E-mail não encontrado",
      text: "Não existe uma conta com esse e-mail.",
      width: "400px",
      confirmButtonText: "Entendi",
      customClass: {
        popup: "meu-swal-popup",
        title: "meu-swal-title",
        htmlContainer: "meu-swal-text",
        icon: "meu-swal-icon",
        confirmButton: "meu-swal-button",
      },
      background: "rgba(0, 0, 60, 0.75)",
      color: "#ffffff",
      backdrop: "rgba(0, 0, 0, 0.45)",
    });
    return;
  }

  Swal.fire({
    position: "center",
    icon: "success",
    title: "E-mail enviado!",
    text: "Verifique sua caixa de entrada para redefinir a senha.",
    showConfirmButton: false,
    timer: 3000,
    width: "400px",
    customClass: {
      popup: "meu-swal-popup",
      title: "meu-swal-title",
      htmlContainer: "meu-swal-text",
      icon: "meu-swal-icon",
    },
    background: "rgba(0, 0, 60, 0.75)",
    color: "#ffffff",
    backdrop: "rgba(0, 0, 0, 0.45)",
  });

  setTimeout(() => {
    window.location.href = "../login/index.html";
  }, 3200);
});
