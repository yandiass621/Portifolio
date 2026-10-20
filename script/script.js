// ========================================
// EFEITO DE DIGITAÇÃO NO SUBTÍTULO
// ========================================

const subtitle = document.querySelector("header h2");

if (subtitle) {
    const originalText = subtitle.textContent;
    let index = 0;

    subtitle.textContent = "";

    function typeEffect() {
        if (index < originalText.length) {
            subtitle.textContent += originalText.charAt(index);
            index++;

            setTimeout(typeEffect, 60);
        }
    }

    typeEffect();
}


// ========================================
// SCROLL SUAVE DA NAVEGAÇÃO
// ========================================

const navLinks = document.querySelectorAll(
    'nav a[href^="#"]'
);

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");
        const target = document.querySelector(href);

        // Evita erros caso o destino não exista.
        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// ========================================
// ANIMAÇÃO FADE-IN AO ROLAR A PÁGINA
// ========================================

const animatedElements = document.querySelectorAll(
    "main section, footer"
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05
        }
    );

    animatedElements.forEach(element => {
        element.classList.add("fade-in");
        observer.observe(element);
    });

} else {
    // Compatibilidade com navegadores sem IntersectionObserver.
    animatedElements.forEach(element => {
        element.classList.add("is-visible");
    });
}


// ========================================
// DESTAQUE DO MENU ATIVO
// ========================================

const navigationTargets = [
    ...document.querySelectorAll("main section[id]"),
    document.querySelector("#contact")
].filter(Boolean);

function updateActiveNavigation() {
    let currentSection = "";

    navigationTargets.forEach(section => {
        const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY;

        if (window.scrollY >= sectionTop - 220) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        const isActive =
            link.getAttribute("href") === `#${currentSection}`;

        link.classList.toggle("active", isActive);
    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================

const backToTop = document.createElement("button");

backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.textContent = "↑";
backToTop.setAttribute("aria-label", "Voltar ao topo");

document.body.appendChild(backToTop);

function updateBackToTop() {
    backToTop.classList.toggle(
        "visible",
        window.scrollY > 300
    );
}

window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
);

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

updateBackToTop();


// ========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ========================================

const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}