export interface IStorageProvider {
  /**
   * Name to use in the storage provider, example: 'local', 's3', 'gcs', etc.
   */
  // providerName: string

  /**
   * Function to check if the storage provider is available, configured and all is ok
   * Example: check the environment variables, check if the credentials are in the correct format, etc.
   */
  isAvailable: () => Promise<boolean>

  /**
   * Function to upload a file to the storage provider
   * @param localFilePath Path to the temporal file created by localbackup (don't delete it after upload, localbackup will do it)
   * @param destinationFilePath Path to the file in the storage provider
   */
  uploadFile: (localFilePath: string, destinationFilePath: string) => Promise<void>

  /**
   * Function to delete a file from the storage provider
   * @param fileFullPath Full path to the file in the storage provider
   */
  deleteFile: (fileFullPath: string) => Promise<void>

  /**
   * Function to list files in a directory in the storage provider
   * @param directoryPath Path to the directory in the storage provider
   * @returns List of files in the directory (full path, including the directoryPath)
   */
  listFiles: (directoryPath: string) => Promise<string[]>
}
