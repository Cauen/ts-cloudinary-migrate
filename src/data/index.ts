import fs from 'fs'
import path from 'path'
import type { DataStore, ResourcePick } from './type'

const emptyStore: DataStore = {
  "downloadedCount": 0,
  "uploadedCount": 0,
  "currentCursor": "",
  "resources": []
}

const storeJsonPath = path.join(__dirname, "store.json")

function get(): DataStore {
  // get current state from ./store.json file
  try {
    const str = fs.readFileSync(storeJsonPath, "utf8")
    return JSON.parse(str)
  } catch (err) {
    return emptyStore
  }
}

function set(dataStore: DataStore) {
  return fs.writeFileSync(storeJsonPath, JSON.stringify(dataStore, null, 2))
}

export function getCursor() {
  return get().currentCursor
}

export function append({ resources, newCursor }: { resources: ResourcePick[], newCursor: string | undefined }) {
  const current = get()
  const currentDownloadedCount = current.downloadedCount
  const newDownloadedCount = currentDownloadedCount + resources.length
  console.log('append', { currentDownloadedCount, newDownloadedCount })
  return set({
    currentCursor: newCursor,
    uploadedCount: current.uploadedCount,
    downloadedCount: current.downloadedCount + resources.length,
    resources: [...current.resources, ...resources]
  })
}

export function getNextUpload(): { resource: ResourcePick, uploadedCount: number, downloadedCount: number } | undefined {
  const { uploadedCount, downloadedCount, resources } = get()
  const resource = resources[uploadedCount]
  if (!resource) return undefined

  return {
    resource: resource,
    uploadedCount,
    downloadedCount,
  }
}

export function getNextUploadChunk(count = 200) {
  const { uploadedCount, downloadedCount, resources } = get()

  const nextChunkResources = resources.slice(uploadedCount, uploadedCount + count)

  return {
    resources: nextChunkResources,
    uploadedCount,
    downloadedCount,
  }
}

export function setUploadedCount(count: number) {
  const current = get()
  return set({
    ...current,
    uploadedCount: count
  })
}