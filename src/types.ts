import type { ResourcePick } from "./data/type"

export interface Resources {
  resources: ResourcePick[]
  next_cursor: string
  rate_limit_allowed: number
  rate_limit_reset_at: string
  rate_limit_remaining: number
}
