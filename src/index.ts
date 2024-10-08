import { download } from "./download"
import { upload } from "./upload"

const operation = process.env.OPERATION || "download"

if (operation.toLowerCase() === "upload") {
  upload()
} else {
  download()
}