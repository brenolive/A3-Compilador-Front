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
    setStatus("Enviando código para o compilador...");

    try {
        const response = await fetch("http://localhost:8080/compilar", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: code
        });

        if (!response.ok) throw new Error("HTTP " + response.status);

        const data = await response.json();

        document.getElementById("tokens-output").textContent = data.tokens;
        document.getElementById("ast-output").textContent = data.ast;
        document.getElementById("semantics-output").textContent = data.semantica;
        document.getElementById("output-run").textContent = data.saida;

        activatePanel("tokens");
        setStatus("Compilação concluída!");

    } catch (err) {
        console.error(err);
        setStatus("Falha ao conectar ao backend.");
        alert("Erro ao conectar ao Java:\n" + err.message);
    }
}
