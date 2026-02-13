// ================================
// EFEITO DE DIGITAÇÃO NO SUBTÍTULO
// ================================
const subtitle = document.querySelector("h2");
const text = subtitle.innerText;
subtitle.innerText = "";

let index = 0;

function typeEffect() {
    if (index < text.length) {
        subtitle.innerText += text.charAt(index);
        index++;
        setTimeout(typeEffect, 60);
    }
}

window.addEventListener("load", typeEffect);


// ================================
// SCROLL SUAVE PERSONALIZADO
// ================================
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// ================================
// ANIMAÇÃO FADE-IN AO ROLAR
// ================================
const sections = document.querySelectorAll("section, .projeto, footer");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = "translateY(40px)";
    section.style.transition = "all 0.8s ease";
    observer.observe(section);
});


// ================================
// DESTAQUE DO MENU ATIVO
// ================================
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    document.querySelectorAll("section").forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.style.color = "white";
        if (link.getAttribute("href").includes(current)) {
            link.style.color = "lightblue";
        }
    });
});


// ================================
// BOTÃO VOLTAR AO TOPO
// ================================
const backToTop = document.createElement("button");
backToTop.innerText = "↑";
backToTop.style.position = "fixed";
backToTop.style.bottom = "30px";
backToTop.style.right = "30px";
backToTop.style.padding = "10px 15px";
backToTop.style.border = "none";
backToTop.style.borderRadius = "50%";
backToTop.style.backgroundColor = "lightblue";
backToTop.style.cursor = "pointer";
backToTop.style.display = "none";
backToTop.style.fontSize = "18px";
backToTop.style.fontWeight = "bold";

document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ================================
// EFEITO HOVER MAIS SUAVE NOS CARDS
// ================================
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "scale(1.05)";
        card.style.transition = "0.3s ease";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
    });
});
