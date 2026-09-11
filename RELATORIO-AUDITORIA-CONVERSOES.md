# Auditoria de conversões e qualidade de dados — 7500 Moldes

**Projeto auditado:** `kiragame7/7500-moldes`  
**Commit analisado:** `1df75d2` (`Update __root.tsx`)  
**Data da auditoria:** 11 de setembro de 2026  
**Escopo:** rastreamento Meta Pixel, Conversions API, UTM/Utmify, links Hotmart, webhook de pagamento, persistência e validação técnica.

## Conclusão executiva

A baixa qualidade dos dados é explicada principalmente por uma cadeia de medição incompleta e não confiável. O projeto dispara eventos diretamente do navegador e tenta duplicá-los no servidor, mas não garante que os eventos cheguem antes da navegação para a Hotmart, não preserva os identificadores de campanha de forma própria e não registra o resultado das chamadas. O evento `Purchase` depende de um webhook genérico que não valida autenticidade, não implementa idempotência e não está claramente conectado ao formato real de webhook da Hotmart.

O risco mais grave para os investimentos é a atribuição de conversões incorreta ou perdida. O Meta Pixel usa o identificador `27483742397970318`, enquanto o pixel da Utmify usa `6a8b75a72de7666ffc73d052`; essa coexistência pode ser válida, mas cria uma segunda cadeia de medição que precisa ser reconciliada com a Hotmart. O código também envia eventos como `ViewContent` e `InitiateCheckout` com uma estrutura de dados fraca, sem valor monetário padronizado, moeda, conteúdo ou identificadores persistentes de sessão/campanha.

Não encontrei banco de dados de eventos no repositório. Portanto, hoje não há uma trilha própria para responder quantos eventos foram tentados, aceitos, rejeitados, duplicados ou associados a uma venda real.

## Classificação dos achados

| Prioridade | Problema | Impacto provável | Evidência |
|---|---|---|---|
| **P0 — crítico** | Webhook público aceita qualquer payload e não valida assinatura | Um terceiro pode forjar compras; vendas falsas podem alimentar a otimização da Meta e contaminar o ROAS | `src/routes/api/public/facebook-webhook.ts:11-14` |
| **P0 — crítico** | Webhook não tem idempotência | Reenvios do provedor podem gerar vários `Purchase` para a mesma venda | `facebook-webhook.ts:21-24` cria um `eventId` aleatório por chamada |
| **P0 — crítico** | O código não verifica `response.ok` da Meta | A API pode rejeitar o evento e o sistema ainda retorna `success: true` | `src/lib/facebook.functions.ts:53-63` |
| **P1 — alto** | Evento client-side e CAPI são disparados juntos, mas sem estratégia de entrega | Duplicidade ou perda de eventos; o usuário pode sair para a Hotmart antes do POST terminar | `src/lib/facebook.hooks.ts:8-29` e links de checkout em `HomeContent.tsx:486, 733, 744` |
| **P1 — alto** | `trackEvent` é assíncrono, mas os links não aguardam sua conclusão | `InitiateCheckout` pode ser cancelado pela abertura da nova aba ou pelo unload da página | `HomeContent.tsx:486` e `HomeContent.tsx:733-744` |
| **P1 — alto** | `Purchase` não é disparado na página; depende somente do webhook incompleto | Compra real pode não ser contabilizada se o webhook não chegar ou se o formato não corresponder | `HomeContent.tsx` não contém `Purchase`; webhook trata apenas `payment_success` ou `status === 'paid'` |
| **P1 — alto** | Identificação de campanha não é preservada em banco próprio nem enviada pelo webhook | A venda pode chegar sem `fbp`, `fbc`, `gclid`, UTM e vínculo com o clique original | `facebook.hooks.ts:15-27`; `types.ts` não possui tabelas |
| **P1 — alto** | `fbc` e `fbp` são lidos somente de cookies e sem decodificação/validação | Em bloqueadores, consentimento, Safari ou mudança de domínio, os identificadores podem faltar | `facebook.hooks.ts:15-16` |
| **P1 — alto** | O `event_id` do navegador é aleatório e não é persistido | Não há reconciliação robusta entre Pixel e CAPI; deduplicação fica frágil | `facebook.hooks.ts:6` e `facebook.functions.ts:39` |
| **P2 — médio** | Dados pessoais enviados à CAPI não são normalizados/hashados no próprio código | E-mail e telefone podem ser rejeitados ou ter baixa correspondência; também há risco de conformidade | `facebook.functions.ts:45-46` |
| **P2 — médio** | `event_time` é sempre o momento do envio, não o momento da conversão | Reenvios tardios alteram a temporalidade e podem prejudicar a atribuição | `facebook.functions.ts:36` |
| **P2 — médio** | Valores dos eventos não têm contrato consistente | `ViewContent` recebe seção; `InitiateCheckout` recebe `price`, mas não `value`/`currency` no formato padronizado | `HomeContent.tsx:134, 486, 733, 744` |
| **P2 — médio** | Token e pixel estão parcialmente hardcoded/configurados de forma dispersa | Rotação, ambientes e auditoria ficam difíceis; aumenta o risco de enviar ao pixel errado | `facebook.functions.ts:4,24` e `__root.tsx:126` |
| **P2 — médio** | Pixel PageView e script Utmify são carregados globalmente sem evidência de consentimento | Pode haver divergência entre navegadores, bloqueios e requisitos de privacidade | `__root.tsx:114-159` |
| **P3 — processo** | Lint falha com 4.251 erros reportados | O pipeline não impede regressões de integração ou alterações mal formatadas | `npm run lint` |

## Fluxo atual identificado

1. A página carrega o Meta Pixel e dispara `PageView` no navegador.
2. A página carrega dois scripts da Utmify: `https://cdn.utmify.com.br/scripts/utms/latest.js` e `https://cdn.utmify.com.br/scripts/pixel/pixel.js`.
3. Ao clicar em alguns botões, o navegador chama `trackEvent`.
4. `trackEvent` gera um `eventId`, envia o evento ao `fbq` e, em paralelo lógico, faz uma chamada server-side para a Conversions API.
5. O botão Premium abre diretamente um checkout da Hotmart em nova aba.
6. O evento `Purchase` só aparece no endpoint `/api/public/facebook-webhook`.
7. Esse endpoint aceita o corpo sem autenticação de provedor e chama a Conversions API com um ID aleatório.
8. Não existe tabela, fila, log estruturado ou mecanismo de reconciliação no projeto.

Esse fluxo não estabelece uma fonte de verdade. A Hotmart é a origem provável da venda, mas a aplicação não mantém um registro correlacionando pedido, clique, campanha, evento da Meta e resposta da API.

## Por que os investimentos podem estar sendo afetados

A plataforma de anúncios otimiza com base nos sinais de conversão que recebe. Se `Purchase` é perdido, o algoritmo subestima campanhas e pode deslocar orçamento para públicos menos eficientes. Se `Purchase` é duplicado ou forjado, o algoritmo superestima campanhas e pode aumentar investimento em tráfego que não produz receita real. Se o evento chega sem `fbc`/`fbp` ou sem dados de usuário correspondentes, a conversão pode ser registrada sem boa atribuição ao anúncio.

A mistura de preços em campos customizados também afeta a leitura econômica. O código envia `price`, mas não garante `value` numérico e `currency` em cada evento de checkout. Assim, mesmo quando o evento é recebido, o valor pode não ser utilizável para otimização por valor ou comparação com a receita da Hotmart.

## Correções recomendadas por ordem

### Fase 1 — interromper a contaminação dos dados

O endpoint de webhook deve aceitar somente requisições autenticadas pelo mecanismo oficial da Hotmart. A assinatura, o timestamp e a tolerância contra replay devem ser validados antes de qualquer chamada à Meta. O payload deve ser validado por esquema, e respostas inválidas devem receber `4xx` em vez de `200`.

Cada venda deve usar como chave idempotente o identificador imutável da transação da Hotmart. Essa chave precisa ser registrada antes do envio ou protegida por uma restrição única. Reenvios do mesmo evento devem retornar sucesso sem disparar outro `Purchase`.

A função da CAPI deve considerar erro HTTP como falha. Ela deve registrar o status, o corpo de erro e o `fbtrace_id` quando existir. O retorno `success: true` só pode ocorrer quando a Meta confirmar o processamento.

### Fase 2 — garantir a qualidade do funil

O evento `InitiateCheckout` deve ser enviado com `value`, `currency`, `content_ids`, `content_type` e um identificador persistente do checkout. O código deve aguardar uma confirmação mínima antes de abrir o checkout, ou usar uma fila local/Beacon apropriada para não perder o evento durante a navegação.

Os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `gbraid` e `wbraid` devem ser capturados na primeira visita e persistidos em cookie próprio ou armazenamento equivalente, respeitando consentimento. Eles devem acompanhar o registro de checkout e ser associados à transação retornada pela Hotmart.

O `event_id` deve ter uma regra determinística por etapa. Para `InitiateCheckout`, ele pode ser derivado de uma sessão de checkout persistente. Para `Purchase`, deve ser derivado do ID da transação. O mesmo ID precisa ser usado no Pixel e na CAPI quando a deduplicação for necessária.

### Fase 3 — criar uma trilha de auditoria

Criar uma tabela de eventos com, no mínimo, `event_name`, `event_id`, `transaction_id`, `event_time`, `received_at`, `utm_*`, `fbclid`, `fbc`, `fbp`, `value`, `currency`, `source`, `request_id`, `provider_status`, `meta_status`, `meta_error` e `dedup_key`. A tabela deve ter índices únicos para `event_id` e para a transação de compra.

Criar uma rotina diária de reconciliação entre vendas aprovadas na Hotmart, eventos `Purchase` enviados à Meta e receita reportada pelos anúncios. O painel precisa separar: venda confirmada, evento enviado, evento aceito, evento atribuído e receita efetivamente recebida.

### Fase 4 — qualidade de engenharia

Corrigir o lint com uma configuração de escopo apropriada e executar `npm run lint` no CI antes do deploy. Adicionar testes para: assinatura inválida, replay, payload inválido, reenvio da mesma transação, erro HTTP da Meta, ausência de cookies, ausência de token, clique no checkout e normalização de valor/moeda.

## Checklist de validação após a correção

| Teste | Resultado esperado |
|---|---|
| Webhook sem assinatura | Rejeitado com `401` ou `403`; nenhum evento enviado à Meta |
| Webhook com assinatura inválida | Rejeitado; tentativa registrada |
| Mesmo webhook enviado duas vezes | Um único `Purchase` efetivo |
| Meta responde `400` | A aplicação registra falha e não informa sucesso |
| Clique no checkout com UTM | UTM e identificadores persistidos e associados ao checkout |
| Navegação imediata para Hotmart | `InitiateCheckout` não é perdido silenciosamente |
| Compra aprovada | `Purchase` usa ID da transação como chave idempotente |
| Compra reembolsada/cancelada | Estado financeiro não é tratado como nova compra |
| Pixel e CAPI para o mesmo evento | Mesmo `event_id` e deduplicação observável |
| Comparação com Hotmart | Quantidade, valor e moeda reconciliam dentro de uma tolerância definida |

## Dados externos necessários para fechar o diagnóstico quantitativo

A inspeção do código identifica as causas prováveis, mas não mede a perda real. Para quantificar o impacto, é necessário exportar um período comparável da Hotmart, da Meta Ads e da Utmify. O conjunto mínimo deve conter data/hora, ID da transação, status da venda, valor, moeda, campanha, conjunto, anúncio, UTM, `fbclid` quando disponível, quantidade de `InitiateCheckout`, quantidade de `Purchase` recebido e quantidade de `Purchase` atribuído.

A comparação deve ser feita por dia e por campanha. A primeira métrica de controle deve ser a razão entre compras aprovadas na Hotmart e compras confirmadas na Meta. A segunda deve ser a diferença entre receita da Hotmart e valor de conversão reportado à Meta. A terceira deve ser a taxa de eventos sem identificadores de atribuição.

## Limitações da auditoria

Esta análise foi feita sobre o código versionado no commit informado. Não foram acessados tokens, configurações privadas da Hotmart, Gerenciador de Eventos da Meta, conta de anúncios, painel da Utmify ou logs de produção. Portanto, não é possível afirmar o volume exato de conversões perdidas ou duplicadas sem os dados operacionais desses serviços.

## Referências

[1]: https://developers.facebook.com/docs/marketing-api/conversions-api/ "Meta Conversions API documentation"
[2]: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/ "Meta event deduplication documentation"
[3]: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event "Meta server event parameters"
[4]: https://developers.facebook.com/docs/marketing-api/conversions-api/quality-recommendations "Meta Conversions API quality recommendations"
[5]: https://developers.facebook.com/docs/marketing-api/conversions-api/gateway-api "Meta Conversions API Gateway documentation"

**Autor:** Manus AI
