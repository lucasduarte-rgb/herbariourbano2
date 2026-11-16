/* =========================================================
   contato.js — formulário com validação e FAQ (contato.html)
   ========================================================= */

/* Regras de validação de cada campo: retornam a mensagem de erro ou "" */
const REGRAS = {
  nome: function (valor) {
    if (!valor.trim()) return "Informe seu nome.";
    if (valor.trim().length < 3) return "O nome precisa ter pelo menos 3 letras.";
    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(valor.trim())) return "Use apenas letras no nome.";
    return "";
  },
  email: function (valor) {
    if (!valor.trim()) return "Informe seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) return "Digite um e-mail válido (ex.: nome@site.com).";
    return "";
  },
  telefone: function (valor) {
    const numeros = valor.replace(/\D/g, "");
    if (!numeros) return ""; // campo opcional
    if (numeros.length < 10 || numeros.length > 11) return "Telefone deve ter DDD + 8 ou 9 dígitos.";
    return "";
  },
  assunto: function (valor) {
    return valor ? "" : "Escolha um assunto.";
  },
  mensagem: function (valor) {
    if (valor.trim().length < 20) return "Escreva pelo menos 20 caracteres (faltam " + (20 - valor.trim().length) + ").";
    return "";
  },
  termos: function (_valor, campo) {
    return campo.checked ? "" : "Você precisa concordar para enviar.";
  }
};

/* Valida um campo e mostra/oculta a mensagem de erro */
function validarCampo(campo) {
  const regra = REGRAS[campo.name];
  if (!regra) return true;

  const erro = regra(campo.value, campo);
  const grupo = campo.closest(".campo");
  const mensagem = grupo.querySelector(".msg-erro");

  mensagem.textContent = erro;
  grupo.classList.toggle("invalido", erro !== "");
  grupo.classList.toggle("valido", erro === "" && campo.type !== "checkbox" && campo.value !== "");
  campo.setAttribute("aria-invalid", erro !== "");
  return erro === "";
}

/* Máscara de telefone: (11) 98765-4321 */
function mascararTelefone(valor) {
  const n = valor.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n.length ? "(" + n : "";
  if (n.length <= 6) return "(" + n.slice(0, 2) + ") " + n.slice(2);
  if (n.length <= 10) return "(" + n.slice(0, 2) + ") " + n.slice(2, 6) + "-" + n.slice(6);
  return "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
}

/* Mostra o resumo do envio no lugar do formulário */
function mostrarSucesso(dados) {
  const form = document.querySelector("#form-contato");
  const sucesso = document.querySelector("#sucesso-envio");
  const textoAssunto = form.querySelector("#assunto option:checked").textContent;

  const primeiroNome = dados.get("nome").trim().split(" ")[0];
  sucesso.querySelector("#sucesso-nome").textContent = primeiroNome;
  sucesso.querySelector("dl").innerHTML = `
    <dt>E-mail</dt><dd></dd>
    <dt>Assunto</dt><dd></dd>
    <dt>Mensagem</dt><dd></dd>`;
  // textContent evita que o texto digitado seja interpretado como HTML
  const dds = sucesso.querySelectorAll("dd");
  dds[0].textContent = dados.get("email");
  dds[1].textContent = textoAssunto;
  dds[2].textContent = dados.get("mensagem");

  form.hidden = true;
  sucesso.classList.add("visivel");
  sucesso.focus();
}

function iniciarFormulario() {
  const form = document.querySelector("#form-contato");
  if (!form) return;

  const campos = form.querySelectorAll("input, select, textarea");
  const telefone = form.querySelector("#telefone");
  const mensagem = form.querySelector("#mensagem");
  const contador = form.querySelector("#contador");
  const limite = Number(mensagem.getAttribute("maxlength"));

  // Valida ao sair do campo e, depois de inválido, a cada digitação
  campos.forEach(function (campo) {
    campo.addEventListener("blur", function () { validarCampo(campo); });
    campo.addEventListener("input", function () {
      if (campo.closest(".campo").classList.contains("invalido")) validarCampo(campo);
    });
    campo.addEventListener("change", function () {
      if (campo.type === "checkbox" || campo.tagName === "SELECT") validarCampo(campo);
    });
  });

  telefone.addEventListener("input", function () {
    telefone.value = mascararTelefone(telefone.value);
  });

  mensagem.addEventListener("input", function () {
    const restantes = limite - mensagem.value.length;
    contador.textContent = mensagem.value.length + " / " + limite + " caracteres";
    contador.style.color = restantes < 30 ? "var(--terracota)" : "";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;
    let primeiroInvalido = null;

    campos.forEach(function (campo) {
      if (!validarCampo(campo)) {
        valido = false;
        if (!primeiroInvalido) primeiroInvalido = campo;
      }
    });

    if (!valido) {
      primeiroInvalido.focus();
      return;
    }

    // Simula o envio (não há servidor neste trabalho)
    const botao = form.querySelector("button[type='submit']");
    botao.disabled = true;
    botao.textContent = "Enviando... 🌱";
    setTimeout(function () {
      mostrarSucesso(new FormData(form));
    }, 900);
  });

  document.querySelector("#nova-mensagem").addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    form.querySelectorAll(".campo").forEach(function (g) { g.classList.remove("valido", "invalido"); });
    form.querySelectorAll(".msg-erro").forEach(function (m) { m.textContent = ""; });
    contador.textContent = "0 / " + limite + " caracteres";
    const botao = form.querySelector("button[type='submit']");
    botao.disabled = false;
    botao.textContent = "Enviar mensagem";
    document.querySelector("#sucesso-envio").classList.remove("visivel");
  });
}

/* ---------- FAQ em acordeão ---------- */
function iniciarFaq() {
  document.querySelectorAll(".faq-pergunta").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const item = botao.closest(".faq-item");
      const resposta = item.querySelector(".faq-resposta");
      const abrir = !item.classList.contains("aberto");

      // Fecha os outros itens abertos
      document.querySelectorAll(".faq-item.aberto").forEach(function (outro) {
        outro.classList.remove("aberto");
        outro.querySelector(".faq-resposta").style.maxHeight = null;
        outro.querySelector(".faq-pergunta").setAttribute("aria-expanded", "false");
      });

      if (abrir) {
        item.classList.add("aberto");
        resposta.style.maxHeight = resposta.scrollHeight + "px";
        botao.setAttribute("aria-expanded", "true");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarFormulario();
  iniciarFaq();
});
