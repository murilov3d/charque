# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-17
### Added
- **GitHub Actions workflow** (`.github/workflows/deploy.yml`): Pipeline CI/CD completo que builda o projeto com Vite e faz deploy automático para GitHub Pages a cada push na branch `main`. Usa `actions/configure-pages`, `upload-pages-artifact` e `deploy-pages`.
- **Ícones PWA** (`public/shark-192x192.png`, `public/shark-512x512.png`): Ícones gerados com silhueta de tubarão neon sobre fundo escuro, necessários para instalação do PWA no celular (exigidos pelo manifest).
- Propriedade `includeAssets` no plugin VitePWA para garantir que ícones e SVGs sejam incluídos no precache do Service Worker.
- Definição explícita de `icons` no Web App Manifest com tamanhos 192x192 e 512x512, incluindo `purpose: 'any maskable'` para compatibilidade com ícones adaptativos Android.

### Fixed
- Erro no GitHub Actions onde `npm ci` falhava devido a um conflito de versão nas dependências (`vite@8` vs `vite-plugin-pwa`), contornado adicionando flag `--legacy-peer-deps`.

### Changed
- **`vite.config.js`**: Adicionado `base: '/charque/'` para servir os assets corretamente no subdiretório do GitHub Pages (`muriloscezar.github.io/charque/`).
- **`vite.config.js`**: `start_url` e `scope` do manifest agora usam `'./'` (relativo) ao invés de `'/'` (absoluto), garantindo que o PWA funcione corretamente quando hospedado em subdiretório.
- **`vite.config.js`**: Nome do app atualizado de "Charque - Snake Game" para "Charque - Neon Shark Hunt" no manifest.

## [Unreleased] - 2026-04-12
### Changed
- Configuração do Vite (`vite.config.js`) alterada para habilitar `server.host: true`, permitindo acesso ao servidor de desenvolvimento através da rede local (necessário para testes em dispositivos móveis).

## [1.0.0] - 2026-04-07
### Added
- Boilerplate inicial do projeto utilizando Vite 8.
- Configuração do **Vite PWA Plugin** para suporte offline com Web App Manifest e Cache de Service Workers.
- Inclusão do **Tailwind CSS** manipulando componentes de UI e estilizadores responsivos.
- Módulo `src/game/GameEngine.js`: Engine unificada contendo gerenciamento de estado da grade, física do tubarão, e rotinas de detecção de colisão.
- Módulo `src/game/Renderer.js`: Renderizador via Canvas 2D utilizando funções `shadowBlur` para garantir a estética Cyberpunk fluorecente, implementando `lerp` (Interpolação Linear) nos movimentos do tubarão para garantir sub-frames fluidos e um sistema estético de partículas na colisão com comida.
- Módulo `src/game/InputHandler.js`: Classe que unifica os métodos de input. Recebendo detecção de `keydown` para desktops, `touchstart/touchend` simulando swipes (gestos rápidos na tela) em Dispositivos Móveis e vinculação aos botões com UI visível do D-Pad virtual.
- Módulo `src/game/Haptics.js`: Acesso isolado à chamada `navigator.vibrate` prover haptics na mordida aos peixes e colisão com final de jogo.
- Persistência e display de *High Score* via LocalStorage.

### Changed
- O `index.html` raiz foi reformulado para utilizar Tailwind (background `#0f172a`), contendo Main Menu simulado como overlay opaco acima do frame do canvas.

### Fixed
- Correção crítica no build de CSS: Removidos arquivos de configuração legados (`postcss.config.js` e `tailwind.config.js`) que conflitavam com o plugin nativo `@tailwindcss/vite` do Tailwind v4.
- Resolvido erro `[plugin:vite:css] [postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin...` que impedia o carregamento de assets e lógica do jogo.

