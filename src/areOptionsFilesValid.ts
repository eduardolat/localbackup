import fse from 'fs-extra'
import chalk from 'chalk'
import { isDir } from './helpers/isDir'

/**
 * Function to check if the source and destination files/directories are valid
 */
export function areOptionsFilesValid (props: {
  source: string
  targetDir: string
  forceTargetDir: boolean
}): boolean {
  // Check if the source file/dir exists
  if (!fse.existsSync(props.source)) {
    console.log(chalk.red('\nThe source file or directory does not exist\n'))
    return false
  }

  // Check if the destination directory exists
  if (props.forceTargetDir && !fse.existsSync(props.targetDir)) {
    fse.ensureDirSync(props.targetDir)
  }
  if (!fse.existsSync(props.targetDir)) {
    console.log(chalk.red('\nThe destination directory does not exist\n'))
    return false
  }

  // Check if the destination is a directory
  if (!isDir(props.targetDir)) {
    console.log(chalk.red('\nThe destination is not a directory\n'))
    return false
  }

  return true
}
