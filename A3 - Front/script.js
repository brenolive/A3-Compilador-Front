// =====================================
// SISTEMA DE ABAS
// =====================================

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const statusText = document.getElementById("status-text");
const themeToggle = document.getElementById("theme-toggle");

// Alternar abas
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;

    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

function activatePanel(id) {
  tabs.forEach(t => {
    t.classList.toggle("active", t.dataset.target === id);
  });
  panels.forEach(p => {
    p.classList.toggle("active", p.id === id);
  });
}

// Atualiza barra de status
function setStatus(msg) {
  statusText.textContent = msg;
}



// =====================================
// SISTEMA DE TEMA (LIGHT / DARK MODE)
// =====================================

(function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
})();

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});



// =====================================
// MOCKS DE ANÁLISE (até integrar com Java)
// =====================================

// ---- ANÁLISE LÉXICA MOCK ----
function runLexicalAnalysis() {
  const code = document.getElementById("code").value;
  const reserved = ["var", "inteiro", "real", "se", "senao", "enquanto", "escreva"];
  const lines = code.split("\n");
  const tokens = [];

  const regex = /[a-zA-Z_]\w*|\d+|==|!=|>=|<=|[=+\-*/(){};:<>]/g;

  lines.forEach((line, i) => {
    const matches = line.match(regex);
    if (!matches) return;

    matches.forEach(lexeme => {
      let type = "IDENT";

      if (reserved.includes(lexeme)) type = "RESERVADO";
      else if (/^\d+$/.test(lexeme)) type = "NUM";
      else if (/^[=+\-*/<>!]+$/.test(lexeme)) type = "OP";

      tokens.push(`L${i + 1}\t'${lexeme}'\t→ ${type}`);
    });
  });

  document.getElementById("tokens-output").textContent =
    tokens.length ? tokens.join("\n") : "Nenhum token encontrado.";

  activatePanel("tokens");
  setStatus("Análise léxica executada (mock).");
}



// ---- ANÁLISE SINTÁTICA MOCK ----
function runSyntaxAnalysis() {
  const code = document.getElementById("code").value.trim();
  let msg;

  if (!code) {
    msg = "Nenhum código fornecido.";
  } else {
    msg =
      "AST simulada (mock):\n\n" +
      "Program\n" +
      " ├── Declarações\n" +
      " ├── Atribuições\n" +
      " └── Comandos (se / enquanto / etc.)";
  }

  document.getElementById("ast-output").textContent = msg;
  activatePanel("ast");
  setStatus("Análise sintática executada (mock).");
}



// ---- ANÁLISE SEMÂNTICA MOCK ----
function runSemanticAnalysis() {
  const msg =
    "Verificação semântica simulada (mock):\n\n" +
    "- Nenhum erro semântico crítico encontrado.\n" +
    "- Tabela de símbolos (exemplo):\n" +
    "  x : inteiro\n" +
    "  y : inteiro\n";

  document.getElementById("semantics-output").textContent = msg;
  activatePanel("semantics");
  setStatus("Análise semântica executada (mock).");
}



// =====================================
// EXECUÇÃO DO CÓDIGO (mock)
// =====================================
function runProgram() {
  const msg =
    "Execução simulada (mock):\n" +
    "Saída esperada do programa: 15\n\n" +
    "// TODO: quando integrar com Java, substituir por execução real.";
  document.getElementById("output-run").textContent = msg;

  activatePanel("output");
  setStatus("Programa executado (mock).");
}



// =====================================
// COMPILAR TUDO (mock) – será substituído pelo endpoint Java
// =====================================
function compileAll() {
  runLexicalAnalysis();
  runSyntaxAnalysis();
  runSemanticAnalysis();

  setStatus("Compilação completa (pipeline mock).");
}
