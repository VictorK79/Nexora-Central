const searchInput = document.getElementById("searchInput");
const searchEmpty = document.getElementById("search-empty");
const faqCards = document.querySelectorAll(".faq-card");
const details = document.querySelectorAll(".faq-list details");

let noResults = document.getElementById("no-results");
if (!noResults) {
  noResults = document.createElement("p");
  noResults.id = "no-results";
  noResults.textContent = "Nenhum resultado encontrado para sua busca.";
  document.getElementById("faq-section").appendChild(noResults);
}

searchInput.addEventListener("input", () => {
  const termo = searchInput.value.trim().toLowerCase();

  if (!termo) {
    faqCards.forEach((card) => card.classList.remove("oculto"));
    details.forEach((d) => (d.open = false));
    noResults.style.display = "none";
    searchEmpty.textContent = "";
    resetCategoria();
    return;
  }

  let totalVisiveis = 0;

  faqCards.forEach((card) => {
    const textoCard = card.textContent.toLowerCase();
    const bate = textoCard.includes(termo);
    card.classList.toggle("oculto", !bate);
    if (bate) {
      totalVisiveis++;
      card.querySelectorAll("details").forEach((d) => {
        const textoDet = d.textContent.toLowerCase();
        d.open = textoDet.includes(termo);
      });
    }
  });

  noResults.style.display = totalVisiveis === 0 ? "block" : "none";

  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("ativo"));
});

function resetCategoria() {
  faqCards.forEach((c) => c.classList.remove("oculto"));
  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("ativo"));
  document.querySelector('[data-cat="todos"]').classList.add("ativo");
  noResults.style.display = "none";
}

document.querySelectorAll(".cat-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;

    searchInput.value = "";
    noResults.style.display = "none";

    document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    faqCards.forEach((card) => {
      if (cat === "todos") {
        card.classList.remove("oculto");
      } else {
        card.classList.toggle("oculto", card.dataset.cat !== cat);
      }
      card.querySelectorAll("details").forEach((d) => (d.open = false));
    });
  });
});
