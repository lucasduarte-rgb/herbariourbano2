/* =========================================================
   encomendas.js — montagem do pedido (encomendas.html)
   ========================================================= */

/* Número que recebe os pedidos no WhatsApp, só dígitos com DDI e DDD.
   Exemplo: "5511987654321". Deixe vazio para só mostrar o resumo. */
const WHATSAPP_NUMERO = "";

const pedido = {}; // { idDaPlanta: quantidade }

/* Cria a lista de plantas com os botões de quantidade */
function montarListaEncomenda() {
  const lista = document.querySelector("#lista-encomenda");
  lista.innerHTML = "";

  PLANTAS.forEach(function (planta) {
    const item = document.createElement("li");
    item.className = "item-encomenda";
    item.innerHTML = `
      <img src="img/${planta.id}.svg" alt="" width="56" height="59">
      <div>
        <strong>${planta.nome}</strong>
        <span>${ROTULOS_LUZ[planta.luz]} · ${ROTULOS_DIFICULDADE[planta.dificuldade]}</span>
      </div>
      <div class="quantidade" role="group" aria-label="Quantidade de ${planta.nome}">
        <button type="button" class="botao-icone" data-acao="menos" aria-label="Diminuir ${planta.nome}">−</button>
        <output id="qtd-${planta.id}">0</output>
        <button type="button" class="botao-icone" data-acao="mais" aria-label="Aumentar ${planta.nome}">+</button>
      </div>`;

    item.querySelectorAll("button").forEach(function (botao) {
      botao.addEventListener("click", function () {
        const atual = pedido[planta.id] || 0;
        const nova = botao.dataset.acao === "mais" ? Math.min(atual + 1, 20) : Math.max(atual - 1, 0);
        if (nova === 0) delete pedido[planta.id];
        else pedido[planta.id] = nova;
        item.querySelector("output").textContent = nova;
        item.classList.toggle("escolhido", nova > 0);
        atualizarResumo();
      });
    });

    lista.appendChild(item);
  });
}

/* Atualiza a caixa "Seu pedido" */
function atualizarResumo() {
  const ul = document.querySelector("#resumo-itens");
  const ids = Object.keys(pedido);
  let total = 0;

  ul.innerHTML = "";
  if (ids.length === 0) {
    ul.innerHTML = '<li class="resumo-vazio">Nenhuma planta escolhida ainda.</li>';
  }
  ids.forEach(function (id) {
    total += pedido[id];
    const li = document.createElement("li");
    li.innerHTML = `<span>${buscarPlanta(id).nome}</span><strong>× ${pedido[id]}</strong>`;
    ul.appendChild(li);
  });

  document.querySelector("#resumo-total").textContent = total;
  if (total > 0) document.querySelector("#erro-plantas").textContent = "";
}

/* Máscara de telefone: (11) 98765-4321 */
function formatarTelefone(valor) {
  const n = valor.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n.length ? "(" + n : "";
  if (n.length <= 6) return "(" + n.slice(0, 2) + ") " + n.slice(2);
  if (n.length <= 10) return "(" + n.slice(0, 2) + ") " + n.slice(2, 6) + "-" + n.slice(6);
  return "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
}

function querEntrega() {
  return document.querySelector("input[name='recebimento']:checked").value === "Entrega";
}

/* Mostra ou esconde o erro de um campo */
function marcarCampo(campo, erro) {
  const grupo = campo.closest(".campo");
  grupo.querySelector(".msg-erro").textContent = erro;
  grupo.classList.toggle("invalido", erro !== "");
  grupo.classList.toggle("valido", erro === "");
  campo.setAttribute("aria-invalid", erro !== "");
  return erro === "";
}

function validarEncomenda(form) {
  const nome = form.querySelector("#enc-nome");
  const telefone = form.querySelector("#enc-telefone");
  const endereco = form.querySelector("#enc-endereco");
  let primeiroErro = null;

  if (Object.keys(pedido).length === 0) {
    document.querySelector("#erro-plantas").textContent = "Escolha pelo menos uma planta.";
    primeiroErro = document.querySelector("#lista-encomenda button");
  }

  const okNome = marcarCampo(nome, nome.value.trim().length < 3 ? "Informe seu nome." : "");
  if (!okNome && !primeiroErro) primeiroErro = nome;

  const digitos = telefone.value.replace(/\D/g, "").length;
  const okTel = marcarCampo(telefone, digitos < 10 ? "Informe um WhatsApp com DDD." : "");
  if (!okTel && !primeiroErro) primeiroErro = telefone;

  if (querEntrega()) {
    const okEnd = marcarCampo(endereco, endereco.value.trim().length < 8 ? "Informe o endereço completo." : "");
    if (!okEnd && !primeiroErro) primeiroErro = endereco;
  }

  if (primeiroErro) primeiroErro.focus();
  return !primeiroErro;
}

/* Monta o texto do pedido (usado no WhatsApp) */
function textoDoPedido(form) {
  const linhas = ["Olá! Quero encomendar:"];
  Object.keys(pedido).forEach(function (id) {
    linhas.push("• " + pedido[id] + "x " + buscarPlanta(id).nome);
  });
  linhas.push("Vaso: " + form.querySelector("input[name='vaso']:checked").value);
  linhas.push("Recebimento: " + form.querySelector("input[name='recebimento']:checked").value);
  if (querEntrega()) linhas.push("Endereço: " + form.querySelector("#enc-endereco").value.trim());
  linhas.push("Nome: " + form.querySelector("#enc-nome").value.trim());
  linhas.push("WhatsApp: " + form.querySelector("#enc-telefone").value);
  const obs = form.querySelector("#enc-obs").value.trim();
  if (obs) linhas.push("Obs.: " + obs);
  return linhas.join("\n");
}

function iniciarEncomendas() {
  const form = document.querySelector("#form-encomenda");
  if (!form) return;

  montarListaEncomenda();

  const telefone = form.querySelector("#enc-telefone");
  telefone.addEventListener("input", function () {
    telefone.value = formatarTelefone(telefone.value);
  });

  form.querySelectorAll("input[name='recebimento']").forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.querySelector("#campo-endereco").hidden = !querEntrega();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validarEncomenda(form)) return;

    const sucesso = document.querySelector("#sucesso-encomenda");
    document.querySelector("#sucesso-enc-nome").textContent = form.querySelector("#enc-nome").value.trim().split(" ")[0];

    const link = document.querySelector("#link-whatsapp");
    if (WHATSAPP_NUMERO) {
      link.href = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(textoDoPedido(form));
      link.hidden = false;
    }

    form.querySelector("button[type='submit']").hidden = true;
    sucesso.classList.add("visivel");
    sucesso.focus();
  });

  document.querySelector("#novo-pedido").addEventListener("click", function () {
    Object.keys(pedido).forEach(function (id) { delete pedido[id]; });
    form.reset();
    form.querySelectorAll(".campo").forEach(function (c) { c.classList.remove("valido", "invalido"); });
    document.querySelector("#campo-endereco").hidden = false;
    document.querySelector("#link-whatsapp").hidden = true;
    form.querySelector("button[type='submit']").hidden = false;
    document.querySelector("#sucesso-encomenda").classList.remove("visivel");
    montarListaEncomenda();
    atualizarResumo();
    window.scrollTo({ top: 0 });
  });
}

document.addEventListener("DOMContentLoaded", iniciarEncomendas);
