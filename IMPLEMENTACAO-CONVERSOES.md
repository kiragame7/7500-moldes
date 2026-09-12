# Implementação de conversões e qualidade de dados

Esta branch (`layout-e-correcao-api`) agora contém a continuação do funil descrito no documento de continuidade: o webhook Hotmart é autenticado, validado, persistido e processado de forma idempotente antes de uma compra aprovada ser enviada à Meta Conversions API.

## Endpoints

O endpoint oficial é `POST /api/webhooks/hotmart`. O header obrigatório é `X-HOTMART-HOTTOK`. O endpoint legado `/api/public/facebook-webhook` permanece apenas como alias compatível e usa exatamente a mesma autenticação; ele não aceita mais payloads genéricos nem eventos forjados.

A Hotmart deve ser configurada com a URL pública da aplicação, a versão de webhook `2.0.0` e os eventos de compra necessários. O contrato implementado reconhece `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_CANCELED`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_EXPIRED`, `PURCHASE_PROTEST`, `PURCHASE_DELAYED` e `PURCHASE_BILLET_PRINTED`. Os dois primeiros podem criar ou completar uma compra; cancelamento, reembolso, chargeback e expiração atualizam o estado financeiro sem gerar uma nova compra aprovada.

## Persistência

A migração `db/migrations/20260912000000_conversion_tracking.sql` cria `conversion_events` e `purchases`, com chaves únicas para `event_id` e `transaction_id`. A camada server-side usa o driver HTTP oficial `@tidbcloud/serverless`, adequado para funções serverless da Vercel, e faz o claim concorrente por atualização condicional do evento, permitindo retry controlado após falha.

O registro de checkout guarda `external_id`, `fbc`, `fbp`, `fbclid`, URL, referenciador, user agent e os cinco UTMs quando o navegador envia `InitiateCheckout`. A Hotmart recebe o mesmo identificador lógico pelo parâmetro `xcod`; quando o webhook retorna esse valor, a compra é associada à atribuição armazenada.

## Meta Conversions API

O evento de compra usa `event_id` determinístico no formato `purchase:<transaction_id>`, o mesmo identificador que deve ser usado pelo Pixel se uma confirmação client-side de compra for adicionada no futuro. E-mail, telefone e `external_id` são normalizados e enviados como SHA-256. `fbc` e `fbp` são preservados sem hash, conforme o contrato da Meta.

A aplicação verifica `response.ok` da Meta e registra o status HTTP, `fbtrace_id` quando disponível, erro sanitizado e número de tentativas. O webhook só retorna sucesso para eventos aprovados depois de o evento idempotente ter sido registrado e a Meta ter confirmado o recebimento. Falhas da Meta retornam `502`, permitindo retry do provedor sem duplicar a venda.

## Configuração segura

Os valores devem ser inseridos no mecanismo de secrets do ambiente de publicação, nunca em `.env` versionado, logs ou código client-side. Os nomes esperados estão em `.env.example`:

- `HOTMART_WEBHOOK_TOKEN` — valor recebido no header HOTTOK da Hotmart;
- `META_CAPI_ACCESS_TOKEN` — token privado da Conversions API;
- `META_TEST_EVENT_CODE` — opcional e temporário, copiado do painel Test Events da Meta; remova depois da validação;
- `META_PIXEL_ID` e `VITE_META_PIXEL_ID` — ID público do Pixel;
- `DATABASE_URL` — URL MySQL/TiDB Cloud com SSL, preferencialmente criada pela integração TiDB Cloud da Vercel;
- `META_GRAPH_API_VERSION` — opcional, com fallback para `v26.0`.

A migração deve ser executada no SQL Editor do TiDB Cloud antes de configurar o webhook da Hotmart. Não há dados fictícios nem envio de compra de teste neste repositório.

## Verificação local

Os comandos previstos são:

```bash
pnpm install --no-frozen-lockfile
pnpm test
pnpm run check
pnpm run build
```

Os testes unitários não chamam Hotmart, Meta ou Supabase. A validação de produção deve começar com um evento real de teste da Hotmart e confirmar, separadamente, o registro em `purchases`, o evento em `conversion_events`, a resposta da Meta e a atribuição no Events Manager.
