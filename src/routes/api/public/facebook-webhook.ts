import { createFileRoute } from '@tanstack/react-router'
import { sendFacebookConversionEvent } from '@/lib/facebook.functions'

export const Route = createFileRoute('/api/public/facebook-webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          
          // Note: This is a placeholder for actual payment provider webhook verification logic.
          // You should verify the signature/source here before processing.
          
          if (body.event === 'payment_success' || body.status === 'paid') {
            const email = body.customer_email || body.email
            const amount = body.amount || body.price || 0
            const currency = body.currency || 'USD'
            
            await sendFacebookConversionEvent({
              data: {
                eventName: 'Purchase',
                eventSourceUrl: request.url,
                eventId: `purchase_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                userData: {
                  email,
                  clientIpAddress: request.headers.get('x-forwarded-for') || undefined,
                  userAgent: request.headers.get('user-agent') || undefined,
                },
                customData: {
                  value: amount,
                  currency: currency,
                }
              }
            })
          }
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Facebook Webhook Error:', error)
          return new Response(JSON.stringify({ success: false, error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    }
  }
})
