# Local Backup 🦄

<p align="left">
  <a href="https://standardjs.com" alt="JavaScript Style Guide">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" />
  </a><a href="https://github.com/eduardolat/localbackup/blob/main/LICENSE" alt="Licence">
    <img src="https://img.shields.io/github/license/eduardolat/localbackup" />
  </a><a href="https://www.npmjs.com/package/localbackup" alt="NPM Package">
    <img src="https://img.shields.io/npm/v/localbackup" />
  </a>
</p>

Utility to make local backups (and now remote) easily and without the hassle. **If you like the project you can leave a star! ⭐️**

## Basic Usage

It's as simple as running the following command:

```console
npx localbackup --source /path/to/source --destdir /path/to/backups-dest --keeplast 10
```

The above command requires node and npm to be installed. It also works without node and has binaries
to run <a href="#without-nodejs">without node</a>.

## Installation options

### With NodeJS (recommended)

You can run localbackup directly with no installation, just node and npm are required:

```console
npx localbackup
```

### Without NodeJS

You can download prebuilt binaries for the three major operating systems (windows, mac and linux)
from the <a href="https://github.com/eduardolat/localbackup/releases">releases page</a>.

Then you can just execute the binary from terminal, windows example:

```console
localbackup.exe --source /path/to/source --destdir /path/to/backups-dest
```

## CLI Options

To see the options available for your version of localbackup you can always run this command:

```console
npx localbackup --help
```

Options:

| Option | Description        |
| ---    | ---                |
| **-s, --source**            | full path of the file or directory to be backed up |
| **-d, --destdir**           | full path of the destination directory where the backup file will be stored |
| **-t, --filetype**          | file type of the backup file (zip or tar) (default: "zip") |
| **-p, --prefix**            | prefix to be added to the backup file name (default: "backup") |
| **-k, --keeplast**          | number of backups to keep (olders with the same prefix will be deleted) |
| **-sp, --storageprovider**  | storage provider to use (local, s3) (default: "local", no config needed) |
| **-y, --yes**               | answer yes to all questions (default: false) |
| **-h, --help**              | display help for command |

Usage:

```console
npx localbackup [options]
```

## Keeplast option

The `--keeplast` option indicates how many backup copies to keep. When executing the command and
after completing the backup, all files within the destination folder that match the
prefix (`--prefix` option) and the extension (`--filetype` option) will be searched and only the
specified amount will be kept (including the one generated in the current execution), the rest will
be permanently deleted.

This option is especially useful when <a href="#usage-with-cron-jobs">working with cron jobs</a>
and want to keep only a specific number of backups to save space or for whatever reason.

If no value is specified, the deletion process will be skipped.

## Examples

Backup folder and keep only the last 10 backups on the destination directory:

```console
npx localbackup --source /path/to/source --destdir /path/to/backups-dest --keeplast 10
```

Backup folder and keep only the last 10 backups using s3 as destination:

```console
export LOCALBACKUP_S3_ENDPOINT="s3.us-west-002.backblazeb2.com"
export LOCALBACKUP_S3_BUCKET="mybucket"
export LOCALBACKUP_S3_ACCESS_KEY="myaccesskey"
export LOCALBACKUP_S3_SECRET_KEY="mysecretkey"

npx localbackup --source /path/to/source --destdir /path/to/backups-dest --keeplast 10 --storageprovider s3
```

Backup single file:

```console
npx localbackup --source /path/to/file.png --destdir /path/to/backups-dest
```

Change destination file prefix:

```console
npx localbackup --source /path/to/source --destdir /path/to/backups-dest --prefix mycustombackup
```

Run with no user confirmation (useful for cronjobs):

```console
npx localbackup --source /path/to/source --destdir /path/to/backups-dest --keeplast 10 --yes
```

## Store backups in S3 bucket

localbackup allows you to use an S3 bucket as a destination for your backups. To use this
feature, you must first set up environment variables that tell localbackup which credentials
to use to connect to S3:

- **LOCALBACKUP_S3_ENDPOINT:** S3 endpoint (optional), useful for compatible providers, not necessary for native S3
- **LOCALBACKUP_S3_BUCKET:** Bucket name (required)
- **LOCALBACKUP_S3_ACCESS_KEY:** Access key (required)
- **LOCALBACKUP_S3_SECRET_KEY:** Secret key (required)

After setting up the environment variables, you can continue using localbackup normally, and to
activate S3, you just need to add the `-sp (--storageprovider)` option to the command:

```console
npx localbackup --source /path/to/source --destdir /path/to/backups-dest --storageprovider s3
```

The above command creates backups and saves them to S3. All other options work the same way.

## Usage with cron jobs

Cron jobs are scheduled tasks that run automatically at specified times or intervals on a
Unix-based system.

You can easily use localbackup inside a cron job to periodically backup files and folders.

This is an example of cron expression that create backups of directory every day at 1:00 PM
and only keep the last 10 backups:

```console
0 13 * * * npx localbackup --source /path/to/source --destdir /path/to/backups-dest --keeplast 10 --yes
```

- Read more about cron jobs: https://www.freecodecamp.org/news/cron-jobs-in-linux/
- Easily create cron expressions: https://crontab.guru/
