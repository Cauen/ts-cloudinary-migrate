import type { UploadApiOptions } from "cloudinary"

export type ResourcePick = Pick<UploadApiOptions, 'folder' | "public_id" | "format" | "resource_type" | "url">

export type DataStore = {
  "downloadedCount": number,
  "uploadedCount": number,
  "currentCursor": string | undefined,
  "resources": Array<ResourcePick>
}