import path from 'node:path'

import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../.env') })

export const env = {
  S3_ENDPOINT: process.env.LOCALBACKUP_S3_ENDPOINT ?? undefined,
  S3_BUCKET: process.env.LOCALBACKUP_S3_BUCKET ?? undefined,
  S3_ACCESS_KEY: process.env.LOCALBACKUP_S3_ACCESS_KEY ?? undefined,
  S3_SECRET_KEY: process.env.LOCALBACKUP_S3_SECRET_KEY ?? undefined
}
