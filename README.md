# 🌿 Herbário Urbano

Guia de plantas para apartamento. Trabalho prático de Desenvolvimento Web (HTML, CSS e JavaScript).

**Dupla:** Lucas Lima e PH

## Como abrir
Basta abrir o arquivo `index.html` no navegador. Não precisa de servidor.

## Páginas
| Página | Conteúdo |
|---|---|
| `index.html` | Página inicial: apresentação, benefícios, contadores animados e a "planta do dia" sorteável |
| `plantas.html` | Catálogo gerado com JavaScript: busca, filtros (luz, dificuldade, pets), favoritos e janela com detalhes |
| `cuidados.html` | Tabela de cuidados por estação, passo a passo e calculadora de rega |
| `contato.html` | Formulário com validação em tempo real, máscara de telefone e perguntas frequentes em acordeão |

## Estrutura de pastas
```
herbario-urbano/
├── index.html, plantas.html, cuidados.html, contato.html
├── css/style.css      → estilos (variáveis, flexbox, grid, media queries, tema escuro)
├── js/dados.js        → base de dados das plantas
├── js/main.js         → menu mobile, tema, rolagem, animações (todas as páginas)
├── js/plantas.js      → catálogo, filtros, favoritos, janela de detalhes
├── js/cuidados.js     → calculadora de rega
├── js/contato.js      → validação do formulário e perguntas frequentes
└── img/               → ilustrações SVG das plantas
```

## Requisitos atendidos
- **HTML semântico:** header, nav, main, section, article, aside, footer, títulos, listas (ul/ol/dl), tabela com caption/thead/scope, imagens com alt e formulário com label.
- **CSS:** layout com Grid e Flexbox, variáveis de cor, fontes do Google Fonts, animações, tema escuro e responsividade (breakpoints em 900px e 720px).
- **JavaScript:** funções, manipulação do DOM, eventos, validação de formulário, dados dinâmicos, localStorage (tema e favoritos) e IntersectionObserver.
- **Acessibilidade:** link "pular para o conteúdo", atributos aria, foco visível, tecla Esc fecha a janela e respeito a `prefers-reduced-motion`.
