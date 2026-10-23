'use server'

import { auth } from '@clerk/nextjs/server'
import { uploadImage } from '@/lib/cloudinary'

/* ============================================================
   UPLOAD ACTION
   ------------------------------------------------------------
   Server Action that accepts a File from a form, validates
   auth, and uploads to Cloudinary. Returns the CDN URL.

   Auth: only signed-in users can upload. In Batch 6A.2 we'll
   add a vendor-ownership check at the point where the URL is
   used (create item), since the upload itself is harmless.
   ============================================================ */

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string }

export async function uploadMenuImage(formData: FormData): Promise<UploadResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Not signed in.' }
    }

    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided.' }
    }

    /* Convert File to Buffer. File.arrayBuffer() gives us an
       ArrayBuffer; Buffer.from() wraps it for Cloudinary. */
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const url = await uploadImage(buffer, file.type)

    return { success: true, url }
  } catch (err) {
    console.error('Upload error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return { success: false, error: message }
  }
}