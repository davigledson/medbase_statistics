console.log('dark mode');

let darkMode = sessionStorage.getItem("darkMode") === "true";

function applyDarkModeStyles() {
    if (darkMode) {
        document.body.classList.add("bg-dark", "text-light");
        document.querySelectorAll(".card").forEach(card => {
            card.classList.add("bg-dark", "text-light", "border-light");
        });
        document.querySelectorAll(".btn").forEach(btn => {
            btn.classList.remove("btn-outline-primary");
            btn.classList.add("btn-outline-light");
        });
    } else {
        document.body.classList.remove("bg-dark", "text-light");
        document.querySelectorAll(".card").forEach(card => {
            card.classList.remove("bg-dark", "text-light", "border-light");
        });
        document.querySelectorAll(".btn").forEach(btn => {
            btn.classList.remove("btn-outline-light");
            btn.classList.add("btn-outline-primary");
        });
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    sessionStorage.setItem("darkMode", darkMode);
    applyDarkModeStyles();
}

function addDarkModeToggleButton() {
    const button = document.createElement("button");
    button.innerHTML = '<i class="bi bi-moon-fill"></i>';
    button.className = "btn btn-dark position-fixed bottom-0 end-0 m-4 rounded-circle shadow";
    button.style.zIndex = "1050";
    button.title = "Alternar modo escuro";

    button.onclick = toggleDarkMode;

    document.body.appendChild(button);
}

document.addEventListener("DOMContentLoaded", () => {
    applyDarkModeStyles();  
    addDarkModeToggleButton();
});
