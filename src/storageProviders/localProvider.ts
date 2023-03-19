import path from 'node:path'
import fse from 'fs-extra'
import { IStorageProvider } from './IStorageProvider'

export class LocalStorageProvider implements IStorageProvider {
  static readonly providerName: string = 'local'

  async isAvailable (): Promise<boolean> {
    return true
  }

  async uploadFile (localFilePath: string, destinationFilePath: string): Promise<void> {
    fse.ensureDirSync(path.dirname(destinationFilePath))

    if (!(await fse.pathExists(localFilePath))) {
      throw new Error(`Local file '${localFilePath}' does not exist.`)
    }
    if (!(await fse.stat(localFilePath)).isFile()) {
      throw new Error(`Local file '${localFilePath}' is not a file.`)
    }
    await fse.copy(localFilePath, destinationFilePath)
  }

  async deleteFile (fileFullPath: string): Promise<void> {
    if (!(await fse.pathExists(fileFullPath))) {
      return
    }
    if (!(await fse.stat(fileFullPath)).isFile()) {
      throw new Error(`'${fileFullPath}' is not a file.`)
    }
    await fse.remove(fileFullPath)
  }

  async listFiles (directoryPath: string): Promise<string[]> {
    if (!(await fse.pathExists(directoryPath))) {
      throw new Error(`Directory '${directoryPath}' does not exist.`)
    }
    if (!(await fse.stat(directoryPath)).isDirectory()) {
      throw new Error(`'${directoryPath}' is not a directory.`)
    }
    const files = await fse.readdir(directoryPath)
    return files.map(file => path.normalize(`${directoryPath}/${file}`))
  }
}

export const localStorageProvider = new LocalStorageProvider()
