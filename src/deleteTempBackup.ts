import chalk from 'chalk'
import ora from 'ora'
import fse from 'fs-extra'

export async function deleteTempBackup (props: {
  localFilePath: string
}): Promise<void> {
  const spinner = ora('Deleting temporal backup file...').start()

  fse.removeSync(props.localFilePath)

  spinner.stop()
  console.log(chalk.gray('✅ Temporal backup file deleted'))
}
