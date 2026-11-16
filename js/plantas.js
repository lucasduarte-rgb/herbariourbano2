/* =========================================================
   plantas.js — catálogo interativo (plantas.html)
   - gera os cards dinamicamente a partir de PLANTAS
   - busca por nome, filtros de luz/dificuldade/pets
   - favoritos salvos no navegador
   - modal com detalhes da planta
   ========================================================= */

const estado = {
  busca: "",
  luz: "todas",
  dificuldade: "todas",
  apenasPets: false,
  apenasFavoritos: false,
  favoritos: lerArmazenamento("favoritos", [])
};

/* Cria o HTML de um card de planta */
function criarCard(planta) {
  const favorita = estado.favoritos.includes(planta.id);
  const artigo = document.createElement("article");
  artigo.className = "card card-planta";

  artigo.innerHTML = `
    <button class="favorito ${favorita ? "ativo" : ""}" data-id="${planta.id}"
      aria-label="${favorita ? "Remover dos" : "Adicionar aos"} favoritos: ${planta.nome}"
      aria-pressed="${favorita}">${favorita ? "❤️" : "🤍"}</button>
    <figure>
      <img src="img/${planta.id}.svg" alt="Ilustração da planta ${planta.nome}" loading="lazy">
    </figure>
    <div class="card-corpo">
      <h3>${planta.nome}</h3>
      <p class="nome-cientifico">${planta.cientifico}</p>
      <ul class="selos">
        <li class="selo">${ROTULOS_LUZ[planta.luz]}</li>
        <li class="selo">${ROTULOS_DIFICULDADE[planta.dificuldade]}</li>
        ${planta.petFriendly ? '<li class="selo selo-pet">🐾 Pet friendly</li>' : ""}
      </ul>
      <button class="botao botao-secundario ver-detalhes" data-id="${planta.id}">Ver cuidados</button>
    </div>`;
  return artigo;
}

/* Aplica todos os filtros sobre a lista de plantas */
function filtrarPlantas() {
  const termo = estado.busca.trim().toLowerCase();

  return PLANTAS.filter(function (planta) {
    const textoBusca = (planta.nome + " " + planta.cientifico).toLowerCase();
    if (termo && !textoBusca.includes(termo)) return false;
    if (estado.luz !== "todas" && planta.luz !== estado.luz) return false;
    if (estado.dificuldade !== "todas" && planta.dificuldade !== estado.dificuldade) return false;
    if (estado.apenasPets && !planta.petFriendly) return false;
    if (estado.apenasFavoritos && !estado.favoritos.includes(planta.id)) return false;
    return true;
  });
}

/* Desenha a grade de cards na tela */
function renderizarCatalogo() {
  const grade = document.querySelector("#grade-plantas");
  const contagem = document.querySelector("#contagem");
  const resultado = filtrarPlantas();

  grade.innerHTML = "";

  if (resultado.length === 0) {
    grade.innerHTML = `
      <div class="vazio">
        <p>🌵 Nenhuma planta encontrada com esses filtros.</p>
        <button class="botao" id="limpar-filtros" style="margin-top:1rem">Limpar filtros</button>
      </div>`;
    document.querySelector("#limpar-filtros").addEventListener("click", limparFiltros);
  } else {
    resultado.forEach(function (planta) {
      grade.appendChild(criarCard(planta));
    });
  }

  const plural = resultado.length === 1 ? "planta encontrada" : "plantas encontradas";
  contagem.textContent = resultado.length + " " + plural +
    " · " + estado.favoritos.length + " nos favoritos";
}

/* Marca/desmarca uma planta como favorita */
function alternarFavorito(id) {
  if (estado.favoritos.includes(id)) {
    estado.favoritos = estado.favoritos.filter(function (f) { return f !== id; });
  } else {
    estado.favoritos.push(id);
  }
  salvarArmazenamento("favoritos", estado.favoritos);
  renderizarCatalogo();
}

/* ---------- Modal de detalhes ---------- */
let ultimoFoco = null;

function abrirModal(id) {
  const planta = buscarPlanta(id);
  if (!planta) return;
  const modal = document.querySelector("#modal");

  modal.querySelector("#modal-img").src = "img/" + planta.id + ".svg";
  modal.querySelector("#modal-img").alt = "Ilustração da planta " + planta.nome;
  modal.querySelector("#modal-titulo").textContent = planta.nome;
  modal.querySelector("#modal-cientifico").textContent = planta.cientifico;
  modal.querySelector("#modal-descricao").textContent = planta.descricao;
  modal.querySelector("#modal-lista").innerHTML = `
    <li><strong>Luz:</strong> ${ROTULOS_LUZ[planta.luz]}</li>
    <li><strong>Rega:</strong> a cada ${planta.regaDias} dias, em média</li>
    <li><strong>Dificuldade:</strong> ${ROTULOS_DIFICULDADE[planta.dificuldade]}</li>
    <li><strong>Animais:</strong> ${planta.petFriendly ? "segura para pets 🐾" : "mantenha longe de pets ⚠️"}</li>`;
  modal.querySelector("#modal-dica").textContent = "💡 " + planta.dica;

  ultimoFoco = document.activeElement;
  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-fechar").focus();
}

function fecharModal() {
  const modal = document.querySelector("#modal");
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (ultimoFoco) ultimoFoco.focus();
}

/* ---------- Filtros ---------- */
function limparFiltros() {
  estado.busca = "";
  estado.luz = "todas";
  estado.dificuldade = "todas";
  estado.apenasPets = false;
  estado.apenasFavoritos = false;

  document.querySelector("#busca").value = "";
  document.querySelector("#dificuldade").value = "todas";
  document.querySelector("#pets").checked = false;
  document.querySelector("#so-favoritos").checked = false;
  document.querySelectorAll(".filtro").forEach(function (b) {
    b.classList.toggle("ativo", b.dataset.luz === "todas");
    b.setAttribute("aria-pressed", b.dataset.luz === "todas");
  });
  renderizarCatalogo();
}

function iniciarCatalogo() {
  const grade = document.querySelector("#grade-plantas");
  if (!grade) return;

  document.querySelector("#busca").addEventListener("input", function (e) {
    estado.busca = e.target.value;
    renderizarCatalogo();
  });

  document.querySelectorAll(".filtro").forEach(function (botao) {
    botao.addEventListener("click", function () {
      document.querySelectorAll(".filtro").forEach(function (b) {
        b.classList.remove("ativo");
        b.setAttribute("aria-pressed", "false");
      });
      botao.classList.add("ativo");
      botao.setAttribute("aria-pressed", "true");
      estado.luz = botao.dataset.luz;
      renderizarCatalogo();
    });
  });

  document.querySelector("#dificuldade").addEventListener("change", function (e) {
    estado.dificuldade = e.target.value;
    renderizarCatalogo();
  });

  document.querySelector("#pets").addEventListener("change", function (e) {
    estado.apenasPets = e.target.checked;
    renderizarCatalogo();
  });

  document.querySelector("#so-favoritos").addEventListener("change", function (e) {
    estado.apenasFavoritos = e.target.checked;
    renderizarCatalogo();
  });

  // Delegação de eventos: um único ouvinte para todos os cards
  grade.addEventListener("click", function (e) {
    const fav = e.target.closest(".favorito");
    const detalhes = e.target.closest(".ver-detalhes");
    if (fav) alternarFavorito(fav.dataset.id);
    if (detalhes) abrirModal(detalhes.dataset.id);
  });

  const modal = document.querySelector("#modal");
  modal.querySelector(".modal-fechar").addEventListener("click", fecharModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) fecharModal(); // clique fora do conteúdo
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("aberto")) fecharModal();
  });

  renderizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
