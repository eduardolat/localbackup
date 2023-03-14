import path from 'node:path'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import fse from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'
import { DATE_FORMAT } from './constants'

dayjs.extend(customParseFormat)

export async function deleteOldBackups (props: {
  targetDirectory: string
  prefix: string
  fileType: 'zip' | 'tar'
  keepLast: string | undefined
}): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!props.keepLast) return

  const keepLast = parseInt(props.keepLast, 10)
  if (keepLast < 1) return

  const spinner = ora('Deleting old backups...').start()

  // Get all files in the target directory that match the prefix and file type
  const dir = await fse.promises.opendir(props.targetDirectory)
  let matches: string[] = []
  for await (const dirent of dir) {
    const fileName = dirent.name
    const isMatch = fileName.startsWith(props.prefix) && fileName.endsWith(props.fileType)
    if (isMatch) {
      matches.push(fileName)
    }
  }

  // Order the files by date
  matches = matches.sort((a, b) => {
    const dateStrA = a.replace(`${props.prefix}-`, '').replace(`.${props.fileType}`, '')
    const dateStrB = b.replace(`${props.prefix}-`, '').replace(`.${props.fileType}`, '')
    const dateA = dayjs(dateStrA, DATE_FORMAT).toDate()
    const dateB = dayjs(dateStrB, DATE_FORMAT).toDate()
    return dateA.getTime() - dateB.getTime()
  })

  // Get last N files and files to delete
  const lastN = matches.slice(keepLast * -1)
  const toDelete = matches.filter((fileName) => !lastN.includes(fileName))

  // Delete files
  for await (const fileName of toDelete) {
    fse.removeSync(path.join(props.targetDirectory, fileName))
  }

  spinner.stop()
  console.log(chalk.gray(`✅ Old backups deleted (${toDelete.length})`))
}
