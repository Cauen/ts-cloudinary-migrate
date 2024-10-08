import { v2 as cloudinary, type UploadApiOptions } from "cloudinary"
import { getNextUpload, getNextUploadChunk, setUploadedCount } from "../data"
import type { ResourcePick } from "../data/type"

async function uploadResource(resource: ResourcePick) {
  const { url, folder, public_id, format, resource_type } = resource
  const publicId = public_id?.replace(`${folder}/`, "")
  const uploaded = await cloudinary.uploader.upload(url, {
    // file
    folder: folder,
    public_id: publicId,
    format,
    resource_type,
    overwrite: true,
  } satisfies UploadApiOptions)

  return uploaded.public_id
}

export async function upload() {
  console.log("upload started")
  let nextUploadChunk = getNextUploadChunk()

  const chunkSize = nextUploadChunk.resources.length
  while (chunkSize) {
    console.log(`Started upload of ${chunkSize} items ${new Date().toISOString()}`)
    const uploads = await Promise.all(nextUploadChunk.resources.map(uploadResource))
    const { downloadedCount, uploadedCount } = nextUploadChunk
    
    const newUploadedCount = uploadedCount + chunkSize
    console.log({ downloadedCount, uploadedCount, newUploadedCount, uploadsLenght: uploads.length, percent: `${(newUploadedCount/downloadedCount * 100).toFixed(2)}%` })
    setUploadedCount(newUploadedCount)
    nextUploadChunk = getNextUploadChunk()
  }
}