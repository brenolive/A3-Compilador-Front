function updateThemeIcon() {
    const btn = document.querySelector(".theme-toggle");
    const isDark = document.body.classList.contains("dark");
    btn.textContent = isDark ? "🌞" : "🌙";
}

function applyTheme(theme) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon();
}

function toggleTheme() {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem("theme") || "dark");
});



function setStatus(msg) {
    document.getElementById("status-bar").textContent = "Status: " + msg;
}



function activatePanel(id) {
    document.querySelectorAll(".result-panel").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

    document.getElementById(id).classList.add("active");

    [...document.querySelectorAll(".tab")].find(t => 
        t.getAttribute("onclick").includes(id)
    ).classList.add("active");
}

async function compileAll() {
    const code = document.getElementById("code").value;
    setStatus("Enviando código...");

  
    document.getElementById("tokens-output").textContent = "Processando análise léxica...";
    document.getElementById("ast-output").textContent = "Processando análise sintática...";
    document.getElementById("semantics-output").textContent = "Processando análise semântica...";
    document.getElementById("output-run").textContent = "Processando saída...";

    function tryParseJson(text) {
        try {
            return JSON.parse(text);
        } catch (_) {
            return null;
        }
    }

    function formatTokens(tokens) {
        if (!Array.isArray(tokens) || tokens.length === 0) return "(sem tokens)";
        return tokens
            .map(t => `${t.type}:${t.value}`)
            .join(" | ");
    }

    function formatLexico(text) {
        const data = tryParseJson(text);
        if (!data) return text;
        return data
            .map(item => {
                const linha = (item.linha ?? "").trim();
                const header = linha ? `Linha: ${linha}` : "Linha: (vazia)";
                const tokens = formatTokens(item.tokens);
                return `${header}\nTokens: ${tokens}`;
            })
            .join("\n\n");
    }

    function formatSintatico(text) {
        const data = tryParseJson(text);
        if (!data) return text;
        return data
            .map(item => {
                const linha = (item.linha ?? "").trim();
                const header = linha ? `Linha: ${linha}` : "Linha: (vazia)";
                return `${header}\nSintático: ${item.sintatico ?? ""}`;
            })
            .join("\n\n");
    }

    function formatSemantico(text) {
        const data = tryParseJson(text);
        if (!data) return text;
        return data
            .map(item => {
                const linha = (item.linha ?? "").trim();
                const header = linha ? `Linha: ${linha}` : "Linha: (vazia)";
                return `${header}\nSemântico: ${item.semantico ?? ""}`;
            })
            .join("\n\n");
    }

    function formatSaida(text) {
        const data = tryParseJson(text);
        if (!data) return text;
        return data
            .map(item => {
                const linha = (item.linha ?? "").trim();
                const header = linha ? `Linha: ${linha}` : "Linha: (vazia)";
                const tokens = formatTokens(item.tokens);
                const sintatico = item.sintatico ?? "";
                const semantico = item.semantico ?? "";
                return `${header}\nTokens: ${tokens}\nSintático: ${sintatico}\nSemântico: ${semantico}`;
            })
            .join("\n\n");
    }

    async function post(endpoint, body) {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status} ao chamar ${endpoint}`);
        }

        return response.text(); // backend retorna texto puro
    }

    try {
 
        const lexicoText = await post("http://localhost:8080/lexico", code);
        document.getElementById("tokens-output").textContent = formatLexico(lexicoText);

     
        const sintaticoText = await post("http://localhost:8080/sintatico", code);
        document.getElementById("ast-output").textContent = formatSintatico(sintaticoText);

     
        const semanticoText = await post("http://localhost:8080/semantico", code);
        document.getElementById("semantics-output").textContent = formatSemantico(semanticoText);

      
        try {
            const saidaText = await post("http://localhost:8080/resultado", code);
            document.getElementById("output-run").textContent = formatSaida(saidaText);
        } catch (e) {
            document.getElementById("output-run").textContent =
                "Endpoint /analisar não implementado.";
        }

        activatePanel("tokens");
        setStatus("Compilação concluída!");

    } catch (error) {
        console.error(error);
        setStatus("Erro ao comunicar com o servidor Java.");
        alert("Erro: " + error.message);
    }
}
