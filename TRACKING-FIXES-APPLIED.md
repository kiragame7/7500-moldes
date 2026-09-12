# Ajustes aplicados ao tracking Meta + UTMify

## 1. UTMify

- Removido o carregamento do `https://cdn.utmify.com.br/scripts/pixel/pixel.js` da página.
- Mantido o `https://cdn.utmify.com.br/scripts/utms/latest.js` para captura/atribuição de UTMs.
- Mantidos os atributos `data-utmify-prevent-xcod-sck` e `data-utmify-prevent-subids`.

Isso evita que o tracker automático do UTMify gere PageView/ViewContent/InitiateCheckout/SubscribedButtonClick em paralelo com a implementação própria.

## 2. PageView

- O PageView deixou de ser disparado diretamente no `<head>`.
- Agora é enviado pela mesma função `trackEvent()` usada pelo restante da implementação.
- Browser e CAPI recebem o mesmo `event_id` por carregamento da página.
- O ID do carregamento é mantido em `window.__moldesPageViewEventId` apenas durante aquele carregamento, evitando reexecução do efeito em modo de desenvolvimento.

## 3. ViewContent

- `getViewContentEventId()` agora gera um ID novo para cada ação real.
- O ID não é mais reutilizado para todos os cliques na mesma seção durante a sessão.
- O mesmo ID gerado no clique é enviado ao Pixel e à CAPI.

## 4. InitiateCheckout

- `getCheckoutEventId()` agora gera um ID novo para cada tentativa real de checkout.
- Browser e CAPI usam o mesmo ID daquela tentativa.
- O mesmo ID deixa de ser reutilizado para cliques futuros no mesmo plano.

## 5. Proteção de envio

- A proteção existente via `sessionStorage` continua ativa para impedir reenvio acidental do mesmo `event_id`.

## Observação de validação

Não foi possível executar `npm run check`/`npm run build` neste ambiente porque o projeto não possui `node_modules` e a instalação via npm não terminou dentro do limite disponível. A alteração foi feita diretamente no código-fonte e revisada estaticamente.

Após publicar a nova versão, faça um teste em aba anônima com uma única visita e um único clique por ação no Meta Events Manager.
