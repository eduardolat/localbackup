import chalk from 'chalk'
import ora from 'ora'
import { storageProviders } from './storageProviders'

export async function uploadBackup (props: {
  storageProvider: string
  localFilePath: string
  destinationFilePath: string
}): Promise<void> {
  const spinner = ora('Uploading backup file...').start()

  await storageProviders[props.storageProvider].uploadFile(props.localFilePath, props.destinationFilePath)

  spinner.stop()
  console.log(chalk.gray('✅ Backup file uploaded'))
}
