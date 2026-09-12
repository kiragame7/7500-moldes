# Deploy mobile CAPI

Esta branch é o alvo oficial do deploy de produção do fix de tracking mobile.

- Branch: `deploy/mobile-capi-fix-production`
- Fix: `navigator.sendBeacon` com fallback `fetch(..., { keepalive: true })`
- Endpoint: `/api/track/conversion`

Este arquivo é apenas um marcador de deploy e não altera a aplicação.
