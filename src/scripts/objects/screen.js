const screen = {
    usertProfile: document.querySelector('.profile-data'),

    // Função para criar HTML de uma seção
    createSection(title, items, itemTemplate) {
        if (!items.length) return '';
        const itemsHtml = items.map(itemTemplate).join('');
        return `
        <div class="${title.toLowerCase()} section">
            <h2>${title}</h2>
            <ul>${itemsHtml}</ul>
        </div>`;
    },

    // Template para repositórios
    repoTemplate(repo) {
        return `
            <li>
                <a href="${repo.html_url}" target="_blank">${repo.name}
                </a>
                    <div class="repo_info">
                        <span title="Forks">🍴 ${repo.forks_count}</span>
                        <span title="Stars">🌟${repo.stargazers_count}</span>
                        <span title="Views">👀 ${repo.watchers_count}</span>
                        <span title="Language">💻 ${repo.language === null ? 'Vazio' : repo.language}</span>
                    </div>
            </li>
            `;
    },

    //template para eventos com o nome do repositório e a mensagem do commit
    eventWithRepoTemplate({ repoUrl, repoName, message }) {
        return `
        <li>
            <a href="${repoUrl}" target="_blank">${repoName}</a> - ${message || 'Sem mensagem de commit'}
        </li>`;
    },

    // Função para renderizar o perfil do usuário
    renderUser(user) {
        const { avatarUrl, name = 'Não possui nome cadastrado 😢', followers, following, bio = 'Não possui bio cadastrada 😢', repositories, events } = user;

        this.usertProfile.innerHTML = `
        <div class="info">
            <img src="${avatarUrl}" alt="Foto do perfil do usuário" />
            <div class="data">
                <h1>${name}</h1>
                <ul>
                    <li>Followers: ${followers}</li>
                    <li>Following: ${following}</li>
                </ul>
                <p>${bio}</p>
            </div>
        </div>
        `;

        // Renderiza a seção de repositórios
        const repositoriesHtml = this.createSection(
            'Repositories',
            repositories,
            this.repoTemplate
        );

        // Filtra e formata os eventos para exibir na seção de eventos
        const commitsWithRepo = events.flatMap(event => {
            const repoName = event.repo?.name || 'Nome do Repositório undefined';
            const repoUrl = `https://github.com/${repoName}`;
            const typeEvent = event.type;

            if (typeEvent === 'PushEvent') {
                return (event.payload?.commits || []).map(commit => ({
                    message: commit.message,
                    repoName,
                    repoUrl
                }));
            } else if (typeEvent === 'CreateEvent') {
                return [{
                    message: 'Sem mensagem de commit',
                    repoName,
                    repoUrl
                }];
            }

            // Retorna um array vazio para ignorar eventos que não são PushEvent ou CreateEvent
            return [];
        });

        // Renderiza a seção de eventos
        const eventsHtml = this.createSection(
            'Events',
            commitsWithRepo,
            this.eventWithRepoTemplate
        );

        // Adiciona as seções de repositórios e eventos ao perfil do usuário
        this.usertProfile.innerHTML += repositoriesHtml + eventsHtml;
    },

    // Função para renderizar mensagem de usuário não encontrado
    renderNotFound() {
        this.usertProfile.innerHTML = "<h3>Usuário não encontrado</h3>";
    }
};

export { screen };
