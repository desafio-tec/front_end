# 💻 LH Tecnologia - Auth Frontend

Aplicação Frontend desenvolvida em **React** com **TypeScript** e **Vite**, criada para consumir a API de Autenticação do Desafio Técnico da LH Tecnologia. O projeto foca em performance, tipagem segura e uma interface limpa utilizando Bootstrap.

## 📋 Sobre o Projeto

Este frontend provê uma interface amigável para o sistema de autenticação. Ele gerencia o estado da aplicação, valida formulários no lado do cliente e interage com o backend de forma segura utilizando tokens JWT.

### Principais Funcionalidades

-   **Login Seguro:** Autenticação de usuários via API, com armazenamento seguro do Token JWT.
    
-   **Cadastro de Usuários:** Formulário com validação de campos para novos registros.
    
-   **Feedback Visual:** Notificações flutuantes (Toastify) para sucesso ou erro nas operações.
    
-   **Rotas Protegidas:** Gerenciamento de navegação utilizando `react-router-dom`.
    
-   **Responsividade:** Interface adaptável a dispositivos móveis e desktop usando **Bootstrap**.
    
-   **Interceptor Axios:** Injeção automática do token de autorização em todas as requisições autenticadas.
    

## 🚀 Tecnologias Utilizadas

-   **React:** Biblioteca para construção de interfaces.
    
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
    
-   **Vite:** Ferramenta de build extremamente rápida.
    
-   **Axios:** Cliente HTTP para comunicação com a API.
    
-   **React Router Dom:** Gerenciamento de rotas (SPA).
    
-   **Bootstrap / React-Bootstrap:** Framework CSS para estilização e componentes responsivos.
    
-   **React-Toastify:** Biblioteca para exibição de alertas e notificações.
    

## 🛠️ Estrutura do Projeto

A organização segue as boas práticas de desenvolvimento React:

```
src/
├── components/     # Componentes reutilizáveis (se houver)
├── pages/          # Páginas da aplicação
│   ├── Login.tsx       # Tela de Login
│   └── Register.tsx    # Tela de Cadastro
├── services/       # Serviços de integração
│   └── api.ts          # Configuração do Axios e Interceptors
├── App.tsx         # Configuração de Rotas
└── main.tsx        # Ponto de entrada e imports globais

```

## ☁️ Guia de Deploy (Vercel)

O deploy é realizado de forma contínua (CI/CD) através da **Vercel**, integrado diretamente ao GitHub.

### Passo a Passo para Deploy

1.  **Repositório GitHub:**
    
    -   Certifique-se de que o código está commitado e enviado para o GitHub (`main`).
        
2.  **Configuração na Vercel:**
    
    -   Acesse [vercel.com](https://vercel.com "null") e crie um "New Project".
        
    -   Importe o repositório `front_end`.
        
    -   **Framework Preset:** Selecione `Vite`.
        
    -   **Root Directory:** `./` (Raiz).
        
3.  **Variáveis de Ambiente (Essencial):** Adicione a variável que aponta para o seu Backend:
    
    Chave
    
    Valor (Exemplo)
    
    `VITE_API_URL`
    
    `https://auth-backend-api.onrender.com`
    
    > **Nota:** Não adicione a barra `/` no final da URL.
    
4.  **Configuração de Rotas (SPA):**
    
    -   Certifique-se de que o arquivo `vercel.json` existe na raiz do projeto com o seguinte conteúdo para evitar erros 404 ao recarregar páginas:
        
    
    ```
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/" }]
    }
    
    ```
    
5.  **Domínio Personalizado (Opcional):**
    
    -   Vá em **Settings > Domains** na Vercel.
        
    -   Adicione seu domínio (ex: `front.lhtecnologia.net.br`).
        
    -   Configure o CNAME no seu provedor de DNS (Cloudflare, Registro.br, etc).
        

## 💻 Execução Local (Desenvolvimento)

Para rodar o projeto na sua máquina:

1.  **Clone o repositório:**
    
    ```
    git clone [https://github.com/SEU_USUARIO/front_end.git](https://github.com/SEU_USUARIO/front_end.git)
    cd front_end
    
    ```
    
2.  **Instale as dependências:**
    
    ```
    npm install
    
    ```
    
3.  **Configure a API (Local):**
    
    -   O projeto já está configurado para tentar conectar em `http://localhost:5000` se a variável `VITE_API_URL` não estiver definida.
        
    -   Ou crie um arquivo `.env` na raiz: `VITE_API_URL=http://localhost:5000`
        
4.  **Inicie o servidor de desenvolvimento:**
    
    ```
    npm run dev
    
    ```
    
5.  **Acesse:** Abra o link exibido no terminal (geralmente `http://localhost:5173`).
    

**Desenvolvido por Lucas Henrique**