/* =========================================================
   cuidados.js — calculadora de rega (cuidados.html)
   Calcula de quantos em quantos dias regar, quanta água usar
   e a data da próxima rega, com base na planta, vaso e estação.
   ========================================================= */

const FATOR_VASO = { pequeno: 0.8, medio: 1, grande: 1.25 };
const AGUA_VASO = { pequeno: 150, medio: 300, grande: 600 }; // em ml
const FATOR_ESTACAO = { verao: 0.75, primavera: 0.9, outono: 1.1, inverno: 1.4 };

/* Preenche o <select> de plantas com os dados de PLANTAS */
function preencherPlantas() {
  const select = document.querySelector("#calc-planta");
  PLANTAS.forEach(function (planta) {
    const opcao = document.createElement("option");
    opcao.value = planta.id;
    opcao.textContent = planta.nome;
    select.appendChild(opcao);
  });
}

/* Sugere a estação atual (hemisfério sul) */
function estacaoAtual() {
  const mes = new Date().getMonth(); // 0 = janeiro
  if (mes === 11 || mes <= 1) return "verao";
  if (mes <= 4) return "outono";
  if (mes <= 7) return "inverno";
  return "primavera";
}

function calcularRega(planta, vaso, estacao) {
  const dias = Math.max(1, Math.round(planta.regaDias * FATOR_VASO[vaso] * FATOR_ESTACAO[estacao]));
  // Plantas de rega espaçada (suculentas, cactos) recebem menos água por vez
  const ajusteAgua = planta.regaDias >= 10 ? 0.6 : 1;
  const agua = Math.round(AGUA_VASO[vaso] * ajusteAgua);

  const proxima = new Date();
  proxima.setDate(proxima.getDate() + dias);

  return { dias: dias, agua: agua, proxima: proxima };
}

function iniciarCalculadora() {
  const form = document.querySelector("#form-calculadora");
  if (!form) return;

  preencherPlantas();
  document.querySelector("#calc-estacao").value = estacaoAtual();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const erro = document.querySelector("#calc-erro");
    const id = document.querySelector("#calc-planta").value;

    if (!id) {
      erro.textContent = "Escolha uma planta para calcular.";
      return;
    }
    erro.textContent = "";

    const planta = buscarPlanta(id);
    const vaso = form.querySelector("input[name='vaso']:checked").value;
    const estacao = document.querySelector("#calc-estacao").value;
    const r = calcularRega(planta, vaso, estacao);

    const dataFormatada = r.proxima.toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long"
    });

    const saida = document.querySelector("#resultado-calc");
    saida.innerHTML = `
      <div class="aviso">
        <p>Regue sua <strong>${planta.nome}</strong> a cada
        <strong>${r.dias} ${r.dias === 1 ? "dia" : "dias"}</strong>,
        usando cerca de <strong>${r.agua} ml</strong> de água.</p>
        <p>📅 Próxima rega: <strong>${dataFormatada}</strong></p>
        <p>💡 ${planta.dica}</p>
      </div>`;
    saida.classList.remove("visivel");
    void saida.offsetWidth; // reinicia a animação
    saida.classList.add("visivel");
  });
}

document.addEventListener("DOMContentLoaded", iniciarCalculadora);
