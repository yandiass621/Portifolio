// ========================================
// CONFIGURAÇÃO DO GITHUB
// ========================================

const GITHUB_USERNAME = "yandiass621";

const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;


// ========================================
// BUSCAR REPOSITÓRIOS
// ========================================

async function fetchProjects() {
    const url = new URL(GITHUB_API_URL);

    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("type", "owner");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Falha ao consultar o GitHub: HTTP ${response.status}`
        );
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
        throw new Error("A resposta do GitHub não é uma lista.");
    }

    return repositories.filter(repository => {
        return (
            !repository.fork &&
            !repository.archived &&
            !repository.private
        );
    });
}


// ========================================
// CRIAR ELEMENTOS HTML
// ========================================

function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = text;

    return element;
}


// ========================================
// CRIAR LINK SEGURO
// ========================================

function createLink(url, text) {
    const link = document.createElement("a");

    link.href = url;
    link.textContent = text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
}


// ========================================
// FORMATAR DATA
// ========================================

function formatDate(dateString) {
    if (!dateString) {
        return "Data indisponível";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Data indisponível";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(date);
}


// ========================================
// MONTAR UM CARD DE PROJETO
// ========================================

function createProjectCard(repository) {
    const card = createElement(
        "article",
        "project-card"
    );

    // Nome do repositório
    const title = createElement(
        "h2",
        "project-title",
        repository.name
    );

    // Descrição
    const description = createElement(
        "p",
        "project-description",
        repository.description ||
            "Este repositório ainda não possui uma descrição."
    );

    // Linguagem principal
    const language = createElement(
        "span",
        "project-language",
        repository.language || "Linguagem não informada"
    );

    // Informações adicionais
    const meta = createElement(
        "div",
        "project-meta"
    );

    const stars = createElement(
        "span",
        "",
        `★ ${repository.stargazers_count} estrelas`
    );

    const updated = createElement(
        "span",
        "",
        `Atualizado: ${formatDate(repository.updated_at)}`
    );

    meta.append(stars, updated);

    // Tecnologias ou assuntos cadastrados como topics no GitHub
    const topics = createElement(
        "div",
        "project-topics"
    );

    (repository.topics || [])
        .slice(0, 5)
        .forEach(topic => {
            const topicElement = createElement(
                "span",
                "project-topic",
                topic
            );

            topics.appendChild(topicElement);
        });

    // Links
    const links = createElement(
        "div",
        "project-links"
    );

    links.appendChild(
        createLink(
            repository.html_url,
            "Ver no GitHub"
        )
    );

    // Só cria a demonstração quando houver um endereço válido.
    if (repository.homepage) {
        try {
            const homepage = new URL(repository.homepage);

            if (
                homepage.protocol === "https:" ||
                homepage.protocol === "http:"
            ) {
                links.appendChild(
                    createLink(
                        homepage.href,
                        "Ver demonstração"
                    )
                );
            }
        } catch {
            // Ignora endereços inválidos.
        }
    }

    card.append(
        title,
        description,
        language,
        meta
    );

    if (topics.childElementCount > 0) {
        card.appendChild(topics);
    }

    card.appendChild(links);

    return card;
}


// ========================================
// MOSTRAR ESTADO DE CARREGAMENTO
// ========================================

function showProjectsStatus(container, message) {
    const status = createElement(
        "p",
        "projects-status",
        message
    );

    status.setAttribute("role", "status");

    container.replaceChildren(status);
}


// ========================================
// CARREGAR E MOSTRAR TODOS OS PROJETOS
// ========================================

async function renderProjects() {
    const container = document.querySelector(
        "#projects-container"
    );

    if (!container) {
        console.error(
            "O elemento #projects-container não foi encontrado."
        );

        return;
    }

    container.setAttribute("aria-busy", "true");

    showProjectsStatus(
        container,
        "Carregando projetos do GitHub..."
    );

    try {
        const projects = await fetchProjects();

        // Limpa a mensagem de carregamento.
        container.replaceChildren();

        if (projects.length === 0) {
            showProjectsStatus(
                container,
                "Nenhum repositório público encontrado."
            );

            return;
        }

        // Cria um card para cada repositório.
        projects.forEach(repository => {
            const card = createProjectCard(repository);

            container.appendChild(card);
        });

    } catch (error) {
        console.error(
            "Erro ao carregar projetos:",
            error
        );

        showProjectsStatus(
            container,
            "Não foi possível carregar os projetos."
        );

        const retryButton = createElement(
            "button",
            "retry-button",
            "Tentar novamente"
        );

        retryButton.type = "button";

        retryButton.addEventListener("click", () => {
            renderProjects();
        });

        container.appendChild(retryButton);

    } finally {
        container.setAttribute("aria-busy", "false");
    }
}


// ========================================
// INICIAR
// ========================================

renderProjects();