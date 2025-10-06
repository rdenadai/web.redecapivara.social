# Rede Capivara - Frontend

Frontend moderno e PWA para o cliente ATProtocol da Rede Capivara.

## 🚀 Tecnologias

- **Vue.js 3** - Framework progressivo
- **Vite** - Build tool e dev server
- **Pinia** - State management
- **Vue Router** - Roteamento
- **Tailwind CSS** - Estilização
- **PWA** - Progressive Web App

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
├── assets/          # Arquivos estáticos
├── components/      # Componentes Vue reutilizáveis
├── views/          # Páginas/Views
├── router/         # Configuração de rotas
├── stores/         # Pinia stores
├── services/       # Serviços (API, etc)
├── App.vue         # Componente raiz
├── main.js         # Entry point
└── style.css       # Estilos globais
```

## 🔐 Autenticação

O app se conecta a um servidor ATProtocol usando as credenciais:

- Usuário/Email
- Senha
- URL do servidor

As credenciais são armazenadas de forma segura no localStorage.

## 📱 PWA

O aplicativo é um Progressive Web App e pode ser instalado em dispositivos móveis e desktop.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT

---

Feito com 💚 no Brasil
