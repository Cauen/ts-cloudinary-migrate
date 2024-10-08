import { v2 as cloudinary } from "cloudinary"
import type { Resources } from "../types"
import { append, getCursor } from "../data"

const pageSize = 500

const downloadPage = async ({ next_cursor }: { next_cursor?: string } = {}): Promise<string> => {
  const res: Resources = await cloudinary.api.resources({
    max_results: pageSize,
    next_cursor,
  })

  append({ resources: res.resources, newCursor: res.next_cursor })
  
  return res.next_cursor
}

const fetchImages = async () => {
  let cursor = getCursor()

  while (cursor !== undefined && cursor !== null) {
    await downloadPage({ next_cursor: cursor || undefined })
    cursor = getCursor()
  }
}

export const download = fetchImages