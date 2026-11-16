/* =========================================================
   main.js — funções comuns a todas as páginas
   - menu mobile
   - tema claro/escuro (salvo no navegador)
   - sombra no cabeçalho ao rolar
   - botão "voltar ao topo"
   - animação de elementos ao aparecer na tela
   - ano automático no rodapé
   - planta do dia e contadores (página inicial)
   ========================================================= */

/* Leitura/gravação segura no localStorage (pode falhar em modo privado) */
function lerArmazenamento(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor === null ? padrao : JSON.parse(valor);
  } catch (erro) {
    return padrao;
  }
}

function salvarArmazenamento(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    /* sem armazenamento disponível: o site continua funcionando */
  }
}

/* ---------- Menu mobile ---------- */
function iniciarMenu() {
  const botao = document.querySelector(".menu-toggle");
  const lista = document.querySelector(".nav-lista");
  if (!botao || !lista) return;

  botao.addEventListener("click", function () {
    const aberto = lista.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
    botao.textContent = aberto ? "✕" : "☰";
  });

  // Fecha o menu ao clicar em um link
  lista.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      lista.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.textContent = "☰";
    });
  });
}

/* ---------- Tema claro/escuro ---------- */
function aplicarTema(escuro) {
  document.body.classList.toggle("tema-escuro", escuro);
  const botao = document.querySelector(".tema-toggle");
  if (botao) {
    botao.textContent = escuro ? "☀️" : "🌙";
    botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
  }
}

function iniciarTema() {
  aplicarTema(lerArmazenamento("temaEscuro", false));

  const botao = document.querySelector(".tema-toggle");
  if (!botao) return;
  botao.addEventListener("click", function () {
    const escuro = !document.body.classList.contains("tema-escuro");
    aplicarTema(escuro);
    salvarArmazenamento("temaEscuro", escuro);
  });
}

/* ---------- Efeitos de rolagem ---------- */
function iniciarRolagem() {
  const cabecalho = document.querySelector(".cabecalho");
  const botaoTopo = document.querySelector(".voltar-topo");

  window.addEventListener("scroll", function () {
    const rolou = window.scrollY > 20;
    if (cabecalho) cabecalho.classList.toggle("rolado", rolou);
    if (botaoTopo) botaoTopo.classList.toggle("visivel", window.scrollY > 500);
  });

  if (botaoTopo) {
    botaoTopo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* Revela elementos com a classe .revelar quando entram na tela */
function iniciarRevelar() {
  const elementos = document.querySelectorAll(".revelar");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (el) { el.classList.add("visivel"); });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(function (el) { observador.observe(el); });
}

/* ---------- Página inicial: contadores animados ---------- */
function animarContador(elemento) {
  const alvo = Number(elemento.dataset.alvo);
  const duracao = 1200;
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    elemento.textContent = Math.floor(progresso * alvo);
    if (progresso < 1) requestAnimationFrame(passo);
    else elemento.textContent = alvo;
  }
  requestAnimationFrame(passo);
}

function iniciarContadores() {
  const contadores = document.querySelectorAll("[data-alvo]");
  if (!contadores.length) return;

  // O número de plantas vem direto da base de dados
  const totalPlantas = document.querySelector("#total-plantas");
  if (totalPlantas && typeof PLANTAS !== "undefined") {
    totalPlantas.dataset.alvo = PLANTAS.length;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  });
  contadores.forEach(function (c) { observador.observe(c); });
}

/* ---------- Página inicial: planta do dia ---------- */
function mostrarPlantaDoDia(sortear) {
  const caixa = document.querySelector("#planta-do-dia");
  if (!caixa || typeof PLANTAS === "undefined") return;

  let indice;
  if (sortear) {
    indice = Math.floor(Math.random() * PLANTAS.length);
  } else {
    // A mesma planta durante todo o dia (baseada na data)
    const hoje = new Date();
    indice = (hoje.getDate() + hoje.getMonth()) % PLANTAS.length;
  }
  const planta = PLANTAS[indice];

  caixa.querySelector("img").src = "img/" + planta.id + ".svg";
  caixa.querySelector("img").alt = "Ilustração da planta " + planta.nome;
  caixa.querySelector("h3").textContent = planta.nome;
  caixa.querySelector(".nome-cientifico").textContent = planta.cientifico;
  caixa.querySelector(".descricao").textContent = planta.descricao;
  caixa.querySelector(".dica").textContent = "💡 " + planta.dica;

  caixa.classList.remove("revelar");
  caixa.style.animation = "none";
  void caixa.offsetWidth; // reinicia a animação
  caixa.style.animation = "surgir 0.4s ease";
}

function iniciarPlantaDoDia() {
  mostrarPlantaDoDia(false);
  const botao = document.querySelector("#sortear-planta");
  if (botao) {
    botao.addEventListener("click", function () {
      mostrarPlantaDoDia(true);
    });
  }
}

/* ---------- Rodapé ---------- */
function atualizarAno() {
  const ano = document.querySelector("#ano-atual");
  if (ano) ano.textContent = new Date().getFullYear();
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", function () {
  iniciarMenu();
  iniciarTema();
  iniciarRolagem();
  iniciarRevelar();
  iniciarContadores();
  iniciarPlantaDoDia();
  atualizarAno();
});
