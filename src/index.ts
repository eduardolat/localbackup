#!/usr/bin/env node

import { program } from 'commander'
import clear from 'clear'
import chalk from 'chalk'
import boxen from 'boxen'
import yesno from 'yesno'
import dayjs from 'dayjs'
import path from 'node:path'
import { areOptionsFilesValid } from './areOptionsFilesValid'
import { createBackup } from './createBackup'
import { deleteOldBackups } from './deleteOldBackups'
import { DATE_FORMAT } from './constants'

clear()
console.log(chalk.green(boxen(chalk.bold('Local Backup 🦄'), { padding: 1, borderStyle: 'double' })))
console.log('')

program
  .option('-y, --yes', 'answer yes to all questions', false)
  .requiredOption('-s, --source <string>', 'full path of the file or directory to be backed up')
  .requiredOption('-d, --destdir <string>', 'full path of the destination directory where the backup file will be stored')
  .option('-t, --filetype <string>', 'file type of the backup file (zip or tar)', 'zip')
  .option('-p, --prefix <string>', 'prefix to be added to the backup file name', 'backup')
  .option('-k, --keeplast <number>', 'number of backups to keep (olders with the same prefix will be deleted)')
  .option('-f, --force', 'force destination folder creation if it does not exist', false)

// Show help if no arguments are passed
if (process.argv.length < 3) {
  program.help()
}

program.parse()
const options = program.opts<{
  yes: boolean
  source: string
  destdir: string
  filetype: 'zip' | 'tar'
  prefix: string
  keeplast: string | undefined
  force: boolean
}>()

async function main (): Promise<void> {
  // Check if the file type is valid
  if (!['zip', 'tar'].includes(options.filetype)) {
    console.log(chalk.red('\nInvalid file type, please use zip or tar\n'))
    return
  }

  const source = path.normalize(options.source)
  const targetDir = path.normalize(options.destdir)
  const targetFileName = `${options.prefix}-${dayjs().format(DATE_FORMAT)}.${options.filetype}`
  const targetFilePath = path.join(targetDir, targetFileName)

  const filesValid = areOptionsFilesValid({
    source,
    targetDir,
    forceTargetDir: options.force
  })
  if (!filesValid) {
    return
  }

  console.log(chalk.bold.yellow('You are about to make a backup with the following parameters:'))
  console.log('')
  console.log(chalk.bold('Source  file/dir:'), source)
  console.log(chalk.bold('Target directory:'), targetDir)
  console.log(chalk.bold('Target file path:'), targetFilePath)
  console.log('')

  if (!options.yes) {
    const ok = await yesno({
      question: 'Are you sure you want to continue? [y/n]:'
    })

    console.log('')

    if (!ok) {
      console.log(chalk.red('Aborted!\n'))
      return
    }
  }

  // Create backup
  await createBackup({
    source,
    targetFilePath,
    fileType: options.filetype
  })

  // Delete old backups
  await deleteOldBackups({
    prefix: options.prefix,
    targetDirectory: targetDir,
    fileType: options.filetype,
    keepLast: options.keeplast
  })

  console.log(chalk.green('\nBackup completed successfully!\n'))
  console.log(chalk.bold('Please give this project a star on GitHub if you like it:'))
  console.log(chalk.bgBlue.bold('⭐️ https://github.com/eduardolat/localbackup\n'))
}

main().catch(console.error)
