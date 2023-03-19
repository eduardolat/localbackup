#!/usr/bin/env node

import path from 'node:path'
import clear from 'clear'
import chalk from 'chalk'
import boxen from 'boxen'
import yesno from 'yesno'
import dayjs from 'dayjs'
import fse from 'fs-extra'
import { program } from 'commander'
import { DATE_FORMAT } from './constants'
import { createTempBackup } from './createTempBackup'
import { deleteOldBackups } from './deleteOldBackups'
import { storageProvidersNames } from './storageProviders'
import { uploadBackup } from './uploadBackup'
import { deleteTempBackup } from './deleteTempBackup'

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
  .option('-sp, --storageprovider <string>', `storage provider to use (${storageProvidersNames.join(', ')})`, 'local')

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
  storageprovider: string
}>()

async function main (): Promise<void> {
  // Check if the file type is valid
  if (!['zip', 'tar'].includes(options.filetype)) {
    console.log(chalk.red('\nInvalid file type, please use zip or tar\n'))
    return
  }

  // Check if the storage provider is valid
  if (!storageProvidersNames.includes(options.storageprovider)) {
    console.log(chalk.red(`\nInvalid storage provider, please use one of the following: ${storageProvidersNames.join(', ')}\n`))
    return
  }

  const source = path.normalize(options.source)
  const targetDir = path.normalize(options.destdir)
  const destinationFileName = `${options.prefix}-${dayjs().format(DATE_FORMAT)}.${options.filetype}`
  const destinationFilePath = path.join(targetDir, destinationFileName)

  // Check if the source file/dir exists
  if (!fse.existsSync(source)) {
    console.log(chalk.red('\nThe source file or directory does not exist\n'))
    return
  }

  console.log(chalk.bold.yellow('You are about to make a backup with the following parameters:'))
  console.log('')
  console.log(chalk.bold('Source  file/dir:'), source)
  console.log(chalk.bold('Target directory:'), targetDir)
  console.log(chalk.bold('Target file path:'), destinationFilePath)
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

  // Create local temporal backup
  const compressedFilePath = await createTempBackup({
    source,
    destinationFileName,
    fileType: options.filetype
  })

  // Upload backup to provider
  await uploadBackup({
    storageProvider: options.storageprovider,
    localFilePath: compressedFilePath,
    destinationFilePath
  })

  // Delete temporal backup
  await deleteTempBackup({
    localFilePath: compressedFilePath
  })

  // Delete old backups from provider
  await deleteOldBackups({
    storageProvider: options.storageprovider,
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
