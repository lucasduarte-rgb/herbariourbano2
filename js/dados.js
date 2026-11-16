/* =========================================================
   dados.js — base de dados das plantas (usada em todas as páginas)
   ========================================================= */

const PLANTAS = [
  {
    id: "costela-de-adao",
    nome: "Costela-de-adão",
    cientifico: "Monstera deliciosa",
    luz: "meia-sombra",
    dificuldade: "facil",
    regaDias: 5,
    petFriendly: false,
    descricao: "Folhas grandes e recortadas que viraram símbolo da decoração com plantas. Cresce rápido e adora espaço.",
    dica: "Limpe as folhas com um pano úmido a cada 15 dias para ela respirar melhor."
  },
  {
    id: "jiboia",
    nome: "Jiboia",
    cientifico: "Epipremnum aureum",
    luz: "sombra",
    dificuldade: "facil",
    regaDias: 4,
    petFriendly: false,
    descricao: "Pendente e muito resistente, perfeita para prateleiras altas e cantos com pouca luz.",
    dica: "Quando as folhas murcham é sinal de sede — ela se recupera poucas horas depois da rega."
  },
  {
    id: "espada-de-sao-jorge",
    nome: "Espada-de-são-jorge",
    cientifico: "Dracaena trifasciata",
    luz: "sombra",
    dificuldade: "facil",
    regaDias: 14,
    petFriendly: false,
    descricao: "Praticamente indestrutível. Tolera pouca luz, ar-condicionado e esquecimentos na rega.",
    dica: "O maior risco é o excesso de água: deixe o substrato secar totalmente."
  },
  {
    id: "zamioculca",
    nome: "Zamioculca",
    cientifico: "Zamioculcas zamiifolia",
    luz: "sombra",
    dificuldade: "facil",
    regaDias: 12,
    petFriendly: false,
    descricao: "Folhas brilhantes e rizomas que armazenam água. Ideal para escritórios e corredores.",
    dica: "Se os caules ficarem tortos procurando luz, aproxime-a um pouco da janela."
  },
  {
    id: "lirio-da-paz",
    nome: "Lírio-da-paz",
    cientifico: "Spathiphyllum wallisii",
    luz: "sombra",
    dificuldade: "media",
    regaDias: 3,
    petFriendly: false,
    descricao: "Uma das poucas plantas que florescem dentro de casa, mesmo com pouca luz.",
    dica: "Gosta de umidade: borrife água nas folhas nos dias mais secos."
  },
  {
    id: "samambaia",
    nome: "Samambaia",
    cientifico: "Nephrolepis exaltata",
    luz: "meia-sombra",
    dificuldade: "media",
    regaDias: 2,
    petFriendly: true,
    descricao: "Clássica das varandas brasileiras, com folhagem volumosa e cheia de vida.",
    dica: "Mantenha o substrato sempre levemente úmido, nunca encharcado."
  },
  {
    id: "echeveria",
    nome: "Echevéria",
    cientifico: "Echeveria elegans",
    luz: "sol",
    dificuldade: "facil",
    regaDias: 10,
    petFriendly: true,
    descricao: "Suculenta em forma de rosa, com folhas carnudas e tom azulado.",
    dica: "Regue o solo, não as folhas — água acumulada no centro pode apodrecer a planta."
  },
  {
    id: "mandacaru",
    nome: "Mandacaru",
    cientifico: "Cereus jamacaru",
    luz: "sol",
    dificuldade: "facil",
    regaDias: 15,
    petFriendly: false,
    descricao: "Cacto nativo da Caatinga, símbolo de resistência. Precisa de muito sol direto.",
    dica: "Use luvas ou jornal dobrado para manusear e evitar os espinhos."
  },
  {
    id: "calathea",
    nome: "Calathea",
    cientifico: "Goeppertia orbifolia",
    luz: "meia-sombra",
    dificuldade: "dificil",
    regaDias: 3,
    petFriendly: true,
    descricao: "Folhas listradas que se fecham à noite, como se a planta “rezasse”.",
    dica: "Prefere água filtrada ou de chuva; o cloro pode queimar as pontas das folhas."
  }
];

/* Rótulos amigáveis para exibir na tela */
const ROTULOS_LUZ = {
  sol: "☀️ Sol pleno",
  "meia-sombra": "⛅ Meia-sombra",
  sombra: "🌥️ Sombra"
};

const ROTULOS_DIFICULDADE = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil"
};

/** Procura uma planta pelo id. */
function buscarPlanta(id) {
  return PLANTAS.find(function (planta) {
    return planta.id === id;
  });
}
