# Contexto de Alterações — Nexora Central

Este documento descreve todas as alterações feitas nas páginas de **registro** (`register/`) e **login** (`login/`) do projeto Nexora Central. Serve como referência técnica completa para entender o estado atual do código.

---

## Estrutura do Projeto

```
Nexora-Central/
├── users.js               ← funções globais de usuário (getUsers, saveUser, findUser)
├── register/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── login/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── dashboard/
    └── index.html         ← destino após login bem-sucedido
```

---

## `users.js` — Funções globais (NÃO alterado, mas essencial entender)

```js
const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
}

const saveUser = (novoUsuario) => {
  const users = getUsers();
  users.push(novoUsuario);
  localStorage.setItem('users', JSON.stringify(users));
}

const findUser = (email, senha) => {
  return getUsers().find(u => u.email === email && u.senha === senha);
}
```

- Os usuários são salvos no **localStorage** do navegador (armazenamento local, não há servidor).
- `getUsers()` lê e retorna a lista de usuários.
- `saveUser(novoUsuario)` adiciona um usuário à lista e salva.
- `findUser(email, senha)` procura um usuário com email E senha correspondentes. Retorna o objeto do usuário se encontrar, ou `undefined` se não encontrar.
- **Ponto crítico:** `findUser` procura pela chave `u.senha`. O objeto salvo pelo registro **deve** usar a chave `senha`, não `password`.

---

## `register/` — Página de Cadastro

### `register/index.html` — Estado atual

**Alterações feitas:**

| Campo | Antes | Depois | Motivo |
|-------|-------|--------|--------|
| `<html lang>` | `lang="en"` | `lang="pt-BR"` | Conteúdo é em português; leitores de tela usavam pronúncia inglesa |
| `<title>` | `Document` | `Criar Conta \| Nexora` | Título padrão do VS Code; aparecia na aba do navegador |
| `&nbsp` | sem `;` | `&nbsp;` | Entidade HTML inválida; espaço não aparecia em alguns navegadores |
| Loading | ausente | `#bg-loader` + `#bg-spinner` | Com internet lenta, o fundo (`abstract wave.png`) demorava a carregar e a tela ficava escura sem feedback |
| Inputs | sem `autocomplete` | com `autocomplete` correto | Navegadores e gerenciadores de senha usam isso para preencher automaticamente |
| Campo Número | sem `inputmode` | `inputmode="numeric"` | No celular, abre teclado numérico em vez do teclado de letras |
| Ícones de olho (senha) | `<i>` sem atributos | `role="button"`, `tabindex="0"`, `aria-label` | Sem isso, leitores de tela ignoram o elemento e usuários de teclado não conseguem focar |
| `#strengthText` | sem `aria-live` | `aria-live="polite"` + `aria-atomic="true"` | Leitores de tela não anunciavam mudanças no indicador de força da senha |
| `#statePassword` | sem `aria-live` | `aria-live="polite"` | Leitores de tela não anunciavam se as senhas coincidem |
| Checkbox termos | sem `aria-required` | `aria-required="true"` | Versão acessível do atributo `required` para leitores de tela |

**Atributos `autocomplete` usados:**
- `given-name` → campo Nome
- `family-name` → campo Sobrenome
- `email` → campo E-Mail
- `street-address` → campo Endereço
- `new-password` → campos Senha e Confirmar Senha (indica ao gerenciador de senhas para criar nova senha)

**Estrutura do `#bg-loader`:**
```html
<div id="bg-loader" aria-hidden="true">
  <div id="bg-spinner"></div>
</div>
```
- Fica logo dentro do `<body>`, antes de tudo.
- `aria-hidden="true"`: leitores de tela ignoram essa div (é apenas visual).
- O spinner é controlado por CSS (animação `girar`) e removido pelo JavaScript quando a imagem carrega.

---

### `register/style.css` — Estado atual

**Alterações feitas:**

1. **`#terms` rule:** havia uma linha em branco extra dentro do bloco. Removida.
2. **`#terms span`:** faltava espaço antes do `{` (`#terms span{` → `#terms span {`). Padrão de formatação.
3. **`#passwordStrength`, `#strengthBar`, `#strengthText`:** esses estilos estavam no meio das media queries (entre `@media 1024px` e `@media 600px`). Foram movidos para antes das media queries, onde deveriam estar.
4. **`#bg-loader`, `#bg-spinner`, `@keyframes girar`:** blocos novos adicionados para o spinner de loading.

**Como o spinner funciona no CSS:**
```css
#bg-loader {
  position: fixed;    /* cobre toda a tela, independente do scroll */
  inset: 0;           /* atalho para top/right/bottom/left: 0 */
  background: #0d0680;/* mesma cor do fallback do body */
  z-index: 9999;      /* fica acima de todo o conteúdo */
  transition: opacity 0.4s ease; /* fade suave ao desaparecer */
}

#bg-loader.oculto {
  opacity: 0;           /* quando a classe .oculto é adicionada, some */
  pointer-events: none; /* não bloqueia mais cliques embaixo */
}

#bg-spinner {
  border: 5px solid rgba(255,255,255,0.2); /* círculo cinza claro completo */
  border-top-color: #4facfe;               /* só o topo é azul — cria efeito de giro */
  border-radius: 50%;                      /* transforma o quadrado em círculo */
  animation: girar 0.8s linear infinite;  /* gira continuamente */
}

@keyframes girar {
  to { transform: rotate(360deg); } /* de 0° a 360° = uma volta completa */
}
```

---

### `register/script.js` — Estado atual

**Alterações feitas:**

1. **Bloco de loading (novo, no topo do arquivo):**
```js
const bgLoader = document.getElementById("bg-loader");

if (bgLoader) {
  const bgImage = new Image();       // cria objeto de imagem invisível
  bgImage.src = "abstract wave.png"; // começa a baixar a imagem de fundo

  const ocultarLoader = () => {
    bgLoader.classList.add("oculto"); // CSS faz o fade-out
    setTimeout(() => {
      bgLoader.remove();              // remove do DOM após o fade
    }, 400);
  };

  bgImage.addEventListener("load", ocultarLoader);  // imagem carregou: some
  bgImage.addEventListener("error", ocultarLoader); // imagem falhou: some também
}
```
- O `error` é tratado para que o spinner não fique preso na tela se o usuário estiver sem internet.

2. **Toggle de senha refatorado:**
```js
// Antes: só click
olho.addEventListener("click", () => { ... });

// Depois: função compartilhada entre click e teclado
const toggleSenha = () => { ... };
olho.addEventListener("click", toggleSenha);
olho.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); // evita que Espaço role a página
    toggleSenha();
  }
});
```
- `Enter` e `Espaço` são os atalhos universais de teclado para ativar um botão.

3. **Chave do objeto `novoUsuario` corrigida:**
```js
// Antes (quebrado):
const novoUsuario = { ..., password: senha };

// Depois (correto):
const novoUsuario = { ..., senha };
```
- `findUser` em `users.js` procura por `u.senha`. Com `password`, o login nunca acharia o usuário.

4. **Botão desabilitado no submit:**
```js
const btnRegistre = document.getElementById("registre");
btnRegistre.disabled = true;
btnRegistre.textContent = "Registrando...";
```
- Executado após todas as validações passarem, antes de `saveUser()`.
- Evita duplo cadastro se o usuário clicar duas vezes rapidamente.

---

## `login/` — Página de Login

### `login/index.html` — Estado atual

**Alterações feitas:**

| Campo | Antes | Depois | Motivo |
|-------|-------|--------|--------|
| `<html lang>` | `lang="en"` | `lang="pt-BR"` | Idioma errado |
| `<title>` | `Document` | `Login \| Nexora` | Título padrão do VS Code |
| Loading | ausente | `#bg-loader` + `#bg-spinner` | Mesma razão do register (imagem `blue-background.png`) |
| Input email | `type="text"`, sem `id`, `for` errado no label, `/` solto | `type="email"`, `id="emailInput"`, `for="emailInput"`, sem `/` | `type="text"` não valida email; sem `id`, o label não tinha vínculo; o `/` solto fechava a tag antecipadamente |
| Input senha | sem `id`, `for` errado, `/` solto | `id="senhaInput"`, `for="senhaInput"`, sem `/` | Mesmos problemas do email |
| `autocomplete` | ausente | `autocomplete="email"` e `autocomplete="current-password"` | `current-password` indica ao gerenciador de senhas para preencher a senha existente (diferente de `new-password` no registro) |
| Checkbox label | `for="revealPassword"` | `for="checkRevealPassword"` | `for` não batia com o `id` do checkbox; clicar no texto não ativava o checkbox |
| Botão | `type=""` | `type="submit"` | `type=""` é inválido; comportamento inconsistente entre navegadores |
| SweetAlert2 | não importado | CDN adicionado | O script.js usa `Swal.fire()`, que requer a biblioteca |

---

### `login/style.css` — Estado atual

**Alterações feitas:**

1. **`#bg-loader`, `#bg-spinner`, `@keyframes girar`:** adicionados (idênticos ao register, mas para `blue-background.png`).

2. **`#container` com dimensões:**
```css
/* Antes: sem dimensões — conteúdo vazava */
#container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Depois: container ocupa exatamente a viewport */
#container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

3. **`#container form` sem height e margin vertical:**
```css
/* Antes: formulário ocupava altura toda e tinha margem que empurrava para fora */
#container form {
  width: 30%;
  height: 100%;       /* ocupava 100% do container → enorme */
  margin: 15% 11rem;  /* 15% de margem vertical + overflow */
}

/* Depois: formulário tem altura natural e só margem lateral */
#container form {
  width: 30%;
  height: auto;       /* altura definida pelo próprio conteúdo */
  margin-right: 11rem;/* só afasta da borda direita */
}
```
- Com `align-items: center` no container, o formulário já fica centralizado verticalmente — a margem vertical era desnecessária e causava o overflow.

4. **Seletor `a` global corrigido:**
```css
/* Antes: afetava TODOS os <a> da página */
#senha span, a { color: white; }

/* Depois: afeta apenas os <a> dentro de #senha */
#senha span, #senha a { color: white; }
```

5. **`font-size: 0.rem` corrigido:**
```css
/* Antes: valor CSS inválido — ignorado pelo navegador */
font-size: 0.rem;

/* Depois: valor válido */
font-size: 1rem;
```

6. **Media queries vazias removidas:** os blocos `@media (max-width: 1024px)` e `@media (max-width: 1600px)` estavam completamente vazios e foram removidos.

7. **Classes `.meu-swal-*` adicionadas:** para estilizar os alertas do SweetAlert2 com o visual do projeto (fundo escuro azulado, bordas arredondadas, blur).

---

### `login/script.js` — Estado atual (reescrito)

**Antes — versão original com múltiplos bugs:**
```js
let login = document.getElementById("login");
let checkPassword = document.getElementById('checkRevealPassword');
let body = document.body;  // declarado mas nunca usado
let revelado = false;

login.addEventListener("click", (e) => {
  e.preventDefault();
  // ERRO: querySelector("input") na div pai — frágil
  const email = document.getElementById("email").querySelector("input").value;
  const senha = document.getElementById("senha").querySelector("input").value;

  // ERRO CRÍTICO: emailsVerificados e senhasVerificados não existem em nenhum arquivo
  // → ReferenceError no console, login NUNCA funciona
  if (emailsVerificados.includes(email) && senhasVerificados.includes(senha)) {
    // ERRO: redirect para o REGISTRO em vez do dashboard
    window.location.href = "../register/index.html";
  } else {
    alert("Email ou senha incorretos!"); // alert nativo, visual inconsistente
  }
});
```

**Depois — versão corrigida:**
```js
// 1. Loading do fundo
const bgLoader = document.getElementById("bg-loader");
if (bgLoader) {
  const bgImage = new Image();
  bgImage.src = "blue-background.png";
  const ocultarLoader = () => {
    bgLoader.classList.add("oculto");
    setTimeout(() => bgLoader.remove(), 400);
  };
  bgImage.addEventListener("load", ocultarLoader);
  bgImage.addEventListener("error", ocultarLoader);
}

let login = document.getElementById("login");
let checkPassword = document.getElementById("checkRevealPassword");
let revelado = false;
// "let body" REMOVIDO — variável nunca era usada

login.addEventListener("click", (e) => {
  e.preventDefault();

  // Inputs acessados diretamente pelo id
  const email = document.getElementById("emailInput").value.trim();
  const senha = document.getElementById("senhaInput").value;

  // findUser() já existe em users.js e faz a busca corretamente
  const usuario = findUser(email, senha);

  if (usuario) {
    window.location.href = "../dashboard/index.html"; // destino correto
  } else {
    Swal.fire({ ... }); // alerta estilizado igual ao register
  }
});

checkPassword.addEventListener("click", () => {
  const senhaInput = document.getElementById("senhaInput");
  revelado = !revelado;
  senhaInput.type = revelado ? "text" : "password"; // ternário simplificado
});
```

---

## Fluxo completo de autenticação (como funciona agora)

```
[register/index.html]
  → usuário preenche o formulário
  → script.js valida todos os campos
  → saveUser({ nome, sobrenome, email, endereco, bairro, numero, senha })
     └→ users.js salva no localStorage com a chave "senha"
  → redireciona para login/index.html

[login/index.html]
  → usuário digita email + senha
  → script.js chama findUser(email, senha)
     └→ users.js busca no localStorage por u.email === email && u.senha === senha
  → se encontrou: redireciona para dashboard/index.html
  → se não encontrou: SweetAlert2 mostra mensagem de erro
```

---

## Biblioteca SweetAlert2

Usada em ambas as páginas para substituir o `alert()` nativo do navegador.

**Como é importada (no final do `<body>`):**
```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

**Parâmetros principais usados:**
```js
Swal.fire({
  icon: "error",              // tipo: "error", "success", "warning", "info"
  title: "Título",            // texto principal em negrito
  text: "Mensagem",           // texto secundário
  confirmButtonText: "Ok",    // texto do botão de confirmação
  customClass: {              // classes CSS personalizadas para estilização
    popup: "meu-swal-popup",
    title: "meu-swal-title",
    htmlContainer: "meu-swal-text",
    icon: "meu-swal-icon",
    confirmButton: "meu-swal-button",
  },
  timer: 2000,                // fecha automaticamente após 2 segundos (usado no sucesso)
  showConfirmButton: false,   // esconde o botão (usado com timer)
});
```

---

## Acessibilidade — resumo dos atributos ARIA usados

| Atributo | Onde | O que faz |
|----------|------|-----------|
| `aria-hidden="true"` | `#bg-loader` | Leitores de tela ignoram completamente o elemento |
| `aria-live="polite"` | `#strengthText`, `#statePassword` | Quando o texto muda, o leitor de tela anuncia em voz alta sem interromper |
| `aria-atomic="true"` | `#strengthText` | Lê o texto inteiro, não só o pedaço que mudou |
| `role="button"` | ícones de olho | Informa que o `<i>` (decorativo por padrão) funciona como botão |
| `tabindex="0"` | ícones de olho | Permite que o elemento receba foco via tecla Tab |
| `aria-label="..."` | ícones de olho | Texto descritivo lido pelo leitor de tela no lugar do conteúdo visual |
| `aria-required="true"` | checkbox de termos | Versão acessível do atributo `required` |

---

## Atualizações posteriores — `login/`

### Troca do checkbox "Mostrar Senha" pelo ícone de olho

**Motivação:** o register usa um ícone Font Awesome animado para mostrar/ocultar a senha. O login usava um checkbox simples, visualmente inconsistente.

**`login/index.html` — mudanças:**
- Font Awesome importado no `<head>` (igual ao register)
- Checkbox + label removidos
- Campo de senha envolto em `<div class="password-box">`
- Ícone `<i class="fa-solid fa-eye eye">` adicionado com `role="button"`, `tabindex="0"` e `aria-label="Mostrar senha"`

```html
<!-- Antes -->
<input name="senha" type="password" id="senhaInput" ... />
<div id="passwordReveal">
  <input type="checkbox" id="checkRevealPassword" />
  <label for="checkRevealPassword">Mostrar Senha</label>
</div>

<!-- Depois -->
<div class="password-box">
  <input name="senha" type="password" id="senhaInput" ... />
  <i
    class="fa-solid fa-eye eye"
    role="button"
    tabindex="0"
    aria-label="Mostrar senha"
  ></i>
</div>
```

**`login/style.css` — mudanças:**
- Regra `#container #passwordReveal label` removida
- `.password-box` e `.eye` adicionados — idênticos ao register

**`login/script.js` — mudanças:**
- `checkPassword` e seu `addEventListener` removidos
- `const olho = document.querySelector(".eye")` adicionado
- Função `toggleSenha()` reutiliza a mesma lógica do register (animação + toggle + suporte a teclado)

```js
const olho = document.querySelector(".eye");

const toggleSenha = () => {
  const senhaInput = document.getElementById("senhaInput");
  olho.classList.add("animando");
  setTimeout(() => {
    revelado = !revelado;
    senhaInput.type = revelado ? "text" : "password";
    olho.classList.toggle("fa-eye");
    olho.classList.toggle("fa-eye-slash");
    olho.classList.remove("animando");
  }, 50);
};

olho.addEventListener("click", toggleSenha);
olho.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleSenha();
  }
});
```

---

### Correções de responsividade — `login/style.css`

**Problemas corrigidos:**

| Propriedade | Antes | Depois | Motivo |
|---|---|---|---|
| `body { height }` | `100vh` | `min-height: 100vh` | Altura fixa impedia scroll no mobile |
| `#container { height }` | `100vh` | `min-height: 100vh` | Mesmo problema |
| `#container form { width }` | `30%` | `35%` | Muito estreito em telas médias |
| `#container form { margin }` | `margin-right: 11rem` | `margin-right: 8rem` | Formulário saía da tela em tablets |

**Media query `@media (max-width: 1024px)` — criada do zero:**
- Formulário: `width: 45%`, `margin-right: 3rem`, `padding: 2rem`
- `#hero-section`: `width: 45%`, `margin-left: 2rem`
- Cards: `flex-direction: column`

**Media query `@media (max-width: 768px)` — reescrita:**
- `body`: `overflow-y: auto` liberado
- `#container`: `flex-direction: column-reverse`, `height: auto`, `overflow: visible`, `padding: 2rem 0`, `gap: 2rem`
- Formulário: `width: 90%`, `margin: 0 auto`
- `#hero-section h1`: `font-size: 1.5rem`
- Cards: coluna, centralizados, `width: 90%`
- Botão: `width: 100%` no mobile
- `#extra`: `flex-direction: column` com `gap: 0.5rem`

---

## `forgotPassword/` — Página de Recuperação de Senha (criada do zero)

### `forgotPassword/index.html`

Estrutura baseada nos padrões do register e login:

```html
<div id="bg-loader" aria-hidden="true">
  <div id="bg-spinner"></div>
</div>
<div id="container">
  <form id="forgot-box">
    <h1>Recuperar senha</h1>
    <p class="subtitle">Digite seu e-mail para receber as instruções</p>
    <label for="emailInput">E-Mail</label>
    <input type="email" id="emailInput" autocomplete="email" required />
    <button type="submit">Enviar</button>
    <span>Lembrou a senha? <a href="../login/index.html">Faça Login</a></span>
  </form>
</div>
```

- `lang="pt-BR"`, `<title>Recuperar Senha | Nexora</title>`
- SweetAlert2, `users.js` e `script.js` importados
- Usa a imagem de fundo do login (`blue-background.png`) via caminho relativo

### `forgotPassword/style.css`

Extrai e une o que é comum entre login e register:

| Bloco | Origem |
|---|---|
| Reset `*`, `body`, fonte, cor de fundo | Ambos |
| `#bg-loader`, `#bg-spinner`, `@keyframes girar` | Ambos |
| `#container` centralizado com `min-height: 100vh` | Register |
| Card `#forgot-box` com `rgba(0,0,60,0.75)`, blur, border-radius | Ambos |
| Labels, inputs, focus com `box-shadow: #4facfe` | Ambos |
| Botão com hover `#132cad` | Ambos |
| Links `#637dff` com hover branco | Register |
| Classes `.meu-swal-*` | Ambos |
| `@keyframes aparecerSwal` | Ambos |
| `@media 1024px` e `@media 768px` | Register |

### `forgotPassword/script.js`

Fluxo completo de validação:

1. **Loading do fundo** — mesmo padrão, aponta para `blue-background.png`
2. **Campo vazio** → SweetAlert de erro
3. **Formato inválido** (`emailRegex`) → SweetAlert de erro
4. **E-mail não cadastrado** (`getUsers().some(u => u.email === email)`) → SweetAlert de erro
5. **E-mail encontrado** → SweetAlert de sucesso + redireciona para login após 3,2 segundos

> **Nota:** por não haver servidor, o "envio de e-mail" é simulado. Com PHP + backend, o passo 5 dispararia um e-mail real com um link de redefinição.

---

## `support/` — Página de Suporte (criada do zero)

### `support/index.html` — Estrutura

```
<header>        ← fixo com blur, logo + navegação
<section#hero>  ← título + barra de busca arredondada
<section#categories> ← botões pill de filtro por categoria
<main#faq-section>   ← cards FAQ em grid com <details> expansíveis
<footer>        ← 4 colunas: sobre, contato, links, redes sociais
```

**Categorias e perguntas:**

| Categoria | `data-cat` | Perguntas |
|---|---|---|
| Matrícula | `matricula` | Como matricular, múltiplos cursos, cancelamento, prazo |
| Pagamento | `pagamento` | Formas aceitas, pagamento recusado, reembolso, comprovante, juros |
| Cursos | `cursos` | Tempo de acesso, ao vivo vs. gravado, download offline, pós-graduação |
| Certificados | `certificado` | Prazo, reconhecimento MEC, validação, segunda via |
| Conta | `conta` | Alterar dados, recuperar senha, transferência, exclusão (LGPD) |
| Técnico | `tecnico` | Vídeo não carrega, navegadores suportados, status do site, app |

**Footer — 4 colunas:**
- Nexora Educação (descrição + CNPJ)
- Contato (telefone, 0800 gratuito, e-mail, horário)
- Links úteis (calendário, política de cancelamento, termos, LGPD, portal)
- Comunidade (Instagram, YouTube, LinkedIn, WhatsApp)

### `support/style.css`

Estilo próprio — fundo escuro sólido (`#0b0b1a`) em vez de imagem, pois é uma página interna (pós-login).

Elementos principais:

| Seletor | Descrição |
|---|---|
| `#site-header` | `position: sticky`, blur, borda inferior sutil |
| `#hero` | Gradiente linear azul, busca arredondada estilo Google |
| `.cat-btn` | Pills com borda sutil; `.ativo` vira azul `#132cad` |
| `.faq-card` | Grid `auto-fill minmax(340px, 1fr)`, blur, hover com borda azul |
| `details summary::after` | Chevron Font Awesome que rotaciona 180° quando aberto |
| `#footer-inner` | Grid `2fr 1fr 1fr 1fr` → `1fr 1fr` em 1024px → `1fr` em 768px |

### `support/script.js` — Como o filtro funciona

**Sistema de `data-cat`:**
- Cada botão tem `data-cat="pagamento"` (por exemplo)
- Cada `<article class="faq-card">` tem `data-cat="pagamento"` correspondente
- O JS lê `btn.dataset.cat` e compara com `card.dataset.cat`
- Cards cujos `data-cat` não batem recebem a classe `.oculto` (`display: none`)
- Para adicionar nova categoria: basta criar o botão e o card com o mesmo `data-cat` — o JS funciona automaticamente

**Busca em tempo real:**
```js
searchInput.addEventListener("input", () => {
  const termo = searchInput.value.trim().toLowerCase();
  faqCards.forEach((card) => {
    const bate = card.textContent.toLowerCase().includes(termo);
    card.classList.toggle("oculto", !bate);
    if (bate) {
      card.querySelectorAll("details").forEach((d) => {
        d.open = d.textContent.toLowerCase().includes(termo);
      });
    }
  });
});
```
- Busca no texto inteiro do card (perguntas + respostas)
- Abre automaticamente os `<details>` que contêm o termo
- Desativa o filtro de categoria enquanto a busca está ativa
- Ao limpar a busca, tudo volta ao estado inicial

---

## Estrutura do Projeto — atualizada

```
Nexora-Central/
├── users.js
├── CONTEXTO_ALTERACOES.md
├── register/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── abstract wave.png
├── login/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── blue-background.png
├── forgotPassword/
│   ├── index.html       ← criado
│   ├── style.css        ← criado
│   └── script.js        ← criado
├── support/
│   ├── index.html       ← criado
│   ├── style.css        ← criado
│   └── script.js        ← criado
└── dashboard/
    └── (vazio — a ser desenvolvido)
```

