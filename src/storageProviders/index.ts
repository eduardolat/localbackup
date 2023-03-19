import { LocalStorageProvider } from './localProvider'
import { S3StorageProvider } from './s3Provider'

const storageProvidersNames = [
  LocalStorageProvider.providerName,
  S3StorageProvider.providerName
]

const storageProviders = {
  [LocalStorageProvider.providerName]: new LocalStorageProvider(),
  [S3StorageProvider.providerName]: new S3StorageProvider()
}

export {
  storageProvidersNames,
  storageProviders
}
