import chalk from 'chalk'
import ora from 'ora'
import fse from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { zip, tar } from 'zip-a-folder'
import { isDir } from './helpers/isDir'

export async function createBackup (props: {
  source: string
  targetFilePath: string
  fileType: 'zip' | 'tar'
}): Promise<void> {
  const spinner = ora('Creating backup...').start()

  let source = props.source
  let isTemporal = false

  // Ensure the source is a directory
  if (!isDir(props.source)) {
    const tmpdir = os.tmpdir()
    const filename = path.basename(props.source)
    const tmpsource = path.join(tmpdir, `easybackups-tmp-${crypto.randomUUID()}`)
    const tmppath = path.join(tmpsource, filename)

    fse.ensureDirSync(tmpsource)
    fse.copySync(props.source, tmppath)

    source = tmpsource
    isTemporal = true
  }

  // Create the backup
  if (props.fileType === 'zip') {
    await zip(source, props.targetFilePath)
  }

  if (props.fileType === 'tar') {
    await tar(source, props.targetFilePath)
  }

  // Remove temporal directory if it was created
  if (isTemporal) {
    fse.removeSync(source)
  }

  spinner.stop()
  console.log(chalk.gray('✅ Backup created'))
}
