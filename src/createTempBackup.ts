import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import chalk from 'chalk'
import ora from 'ora'
import fse from 'fs-extra'
import { zip, tar } from 'zip-a-folder'
import { isDir } from './helpers/isDir'

export async function createTempBackup (props: {
  source: string
  destinationFileName: string
  fileType: 'zip' | 'tar'
}): Promise<string> {
  const spinner = ora('Creating temporal backup file...').start()
  const tmpdir = path.join(os.tmpdir(), `localbackup-tmp-${crypto.randomUUID()}`)
  fse.ensureDirSync(tmpdir)

  let source = props.source
  let isTemporal = false

  // Ensure the source is a directory
  if (!isDir(props.source)) {
    const filename = path.basename(props.source)
    const tmpsource = path.join(tmpdir, 'source')
    const tmppath = path.join(tmpsource, filename)

    fse.ensureDirSync(tmpsource)
    fse.copySync(props.source, tmppath)

    source = tmpsource
    isTemporal = true
  }

  // Create the target directory
  const targetdir = path.join(tmpdir, 'target')
  const targetfilepath = path.join(targetdir, props.destinationFileName)
  fse.ensureDirSync(targetdir)

  // Create the backup
  if (props.fileType === 'zip') {
    await zip(source, targetfilepath)
  }

  if (props.fileType === 'tar') {
    await tar(source, targetfilepath)
  }

  // Remove temporal directory if it was created
  if (isTemporal) {
    fse.removeSync(source)
  }

  spinner.stop()
  console.log(chalk.gray('✅ Temporal backup file created'))

  return targetfilepath
}
