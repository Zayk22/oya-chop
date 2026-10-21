/* ============================================================
   PAYSTACK HELPERS
   ------------------------------------------------------------
   Plain fetch, no SDK. Two endpoints we use:
   - POST /transaction/initialize — start a payment
   - GET  /transaction/verify/:ref — confirm a payment

   Secret key comes from PAYSTACK_SECRET_KEY. Never exposed
   to the client.
   ============================================================ */

const PAYSTACK_BASE = 'https://api.paystack.co'

function paystackHeaders() {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    throw new Error('PAYSTACK_SECRET_KEY is not set')
  }
  return {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  }
}

export type InitializeParams = {
  email: string
  amountKobo: number
  reference: string
  callbackUrl: string
  metadata?: Record<string, unknown>
}

export type InitializeResult = {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export async function initializePayment(
  params: InitializeParams
): Promise<InitializeResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: paystackHeaders(),
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Paystack initialize failed: ${res.status} ${text}`)
  }

  const json = await res.json()

  if (!json.status) {
    throw new Error(`Paystack error: ${json.message ?? 'unknown'}`)
  }
  
  console.log('Paystack init response:', JSON.stringify(json.data, null, 2))

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  }
}

export type VerifyResult = {
  status: 'success' | 'failed' | 'abandoned' | 'ongoing' | 'pending'
  amountKobo: number
  reference: string
  currency: string
}

export async function verifyPayment(reference: string): Promise<VerifyResult> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: paystackHeaders() }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Paystack verify failed: ${res.status} ${text}`)
  }

  const json = await res.json()

  if (!json.status) {
    throw new Error(`Paystack error: ${json.message ?? 'unknown'}`)
  }

  return {
    status: json.data.status,
    amountKobo: json.data.amount,
    reference: json.data.reference,
    currency: json.data.currency,
  }
}