<div align="center">
  <img src="public/capivara-icon.svg" alt="Rede Capivara Logo" width="200"/>
  
  # Rede Capivara - Frontend
  
  Frontend moderno e PWA para o cliente ATProtocol da Rede Capivara.
  
  ### ⚠️ Work in Progress
  
  > Este projeto está em desenvolvimento ativo. Recursos, API e estrutura podem mudar significativamente.
</div>

## 🚀 Tecnologias

- **Vue.js 3** - Framework progressivo JavaScript
- **Vite** - Build tool e dev server ultrarrápido
- **Pinia** - State management moderno para Vue
- **Vue Router** - Roteamento SPA
- **Tailwind CSS** - Framework de estilização utility-first
- **Vite PWA Plugin** - Progressive Web App com service workers
- **Axios** - Cliente HTTP para requisições API
- **@vueuse/core** - Coleção de composables Vue

## 🎨 Paleta de Cores

- **Capivara Brown** (#7A5C3E) - Cor de apoio para identidade
- **Sky Blue** (#4DA6FF) - Destaque e links
- **Off-White** (#F5F5F5) - Fundo neutro
- **Cinza-pedra** (#444444) - Textos e ícones
- **Verde-lago** (#3DBB84) - Ações positivas (botões, links)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🏗️ Estrutura do Projeto

```
src/
├── assets/          # Arquivos estáticos (imagens, ícones)
├── components/      # Componentes Vue reutilizáveis
│   ├── ExternalElement.vue
│   ├── ImageList.vue
│   ├── InstallButton.vue
│   ├── ParsedPost.vue
│   └── ToastNotification.vue
├── views/           # Páginas/Views principais
│   ├── logged/      # Views autenticadas
│   │   ├── FeedView.vue
│   │   ├── FollowersView.vue
│   │   ├── FollowingView.vue
│   │   ├── ProfileView.vue
│   │   ├── TimelineView.vue
│   │   └── UserProfile.vue
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── MenuView.vue
│   └── MigrateView.vue
├── router/          # Configuração de rotas Vue Router
├── stores/          # Pinia stores (auth, etc)
├── services/        # Serviços de API (ATProtocol)
├── composables/     # Vue composables reutilizáveis
├── utils/           # Funções utilitárias
├── App.vue          # Componente raiz
├── main.js          # Entry point
└── style.css        # Estilos globais Tailwind
```

## 🔐 Autenticação

O aplicativo se conecta a um servidor ATProtocol (como Bluesky ou Rede Capivara) usando:

- **Identificador**: Usuário, handle (@usuario.dominio) ou email
- **Senha**: Senha da conta ATProtocol
- **Servidor**: URL do servidor (padrão: https://redecapivara.social)

As credenciais são armazenadas com segurança no localStorage com validação JWT.

## ✨ Funcionalidades

- 🔐 Login e autenticação ATProtocol
- 📱 Timeline de posts dos seguidos
- 👤 Visualização de perfis
- 👥 Lista de seguidores e seguindo
- 🖼️ Suporte a imagens e links externos
- 📝 Renderização de posts com @menções e links
- 🌐 Modo offline com indicadores
- 🔔 Sistema de notificações toast
- 📲 Instalável como PWA
- 🔄 Migração de contas do Bluesky (em desenvolvimento)

## 📱 PWA

O aplicativo é um Progressive Web App completo e pode ser instalado em dispositivos móveis e desktop. Inclui:

- Service Worker para cache offline
- Manifesto para instalação
- Ícones otimizados para diferentes plataformas
- Detecção automática de instalação

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests
- 📖 Melhorar a documentação

## 🌐 Links

- [Rede Capivara](https://redecapivara.social)
- [ATProtocol](https://atproto.com)
- [Bluesky](https://bsky.app)

## 📄 Licença

MIT

---

<div align="center">
  Feito com 💚 no Brasil
</div>
