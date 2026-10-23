import { v2 as cloudinary } from 'cloudinary'

/* ============================================================
   CLOUDINARY CLIENT
   ------------------------------------------------------------
   Server-only. Configured once on first use. Credentials come
   from env vars (never exposed to the browser).
   ============================================================ */

let configured = false

function getClient() {
  if (!configured) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Cloudinary env vars are not set. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
      )
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })

    configured = true
  }

  return cloudinary
}

/* Allowed image types. SVG is deliberately excluded —
   SVG can contain <script> tags and becomes an XSS vector. */
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * Uploads a file buffer to Cloudinary under the given folder.
 * Returns the secure HTTPS URL of the uploaded image.
 *
 * Throws on validation failure or upload failure. Callers should
 * wrap in try/catch and return a user-friendly message.
 */
export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  folder = 'oya-chop/menu'
): Promise<string> {
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error('Only JPEG, PNG, or WebP images are allowed.')
  }

  if (buffer.length > MAX_SIZE_BYTES) {
    throw new Error('Image must be smaller than 5MB.')
  }

  const client = getClient()

  return new Promise<string>((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        /* Auto-optimize: strip metadata, best quality format, etc. */
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? 'Upload failed'))
          return
        }
        resolve(result.secure_url)
      }
    )

    uploadStream.end(buffer)
  })
}