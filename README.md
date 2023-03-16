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

Utility to make local backups easily and without the hassle. **If you like the project you can leave a star! ⭐️**

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

| Option | Description |
| ---    | ---         |
| **-s, --source**     | full path of the file or directory to be backed up |
| **-d, --destdir**    | full path of the destination directory where the backup file will be stored |
| **-t, --filetype**   | file type of the backup file (zip or tar) (default: "zip") |
| **-p, --prefix**     | prefix to be added to the backup file name (default: "backup") |
| **-k, --keeplast**   | number of backups to keep (olders with the same prefix will be deleted) |
| **-f, --force**      | force destination folder creation if it does not exist (default: false) |
| **-y, --yes**        | answer yes to all questions (default: false) |
| **-h, --help**       | display help for command |

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

## Store backups remotely (FTP, S3, Backblaze, etc.)

The localbackup tool only works locally, meaning that your backups are stored on the same hard drive
as the original files. Although this option may be sufficient for many cases, it is always
recommended to store your most important backups in secondary storage systems such as FTP or S3 so
that you always have an option to access your files in case of a total loss of your local disk.

localbackup can greatly simplify the backup creation process and is focused on being very easy to
use. Once you have your backups on your local disk, there are several options for uploading them to
secondary storage, including:

- Manually upload files
- Using specific tools for each service (AWS CLI, B2 CLI, etc)
- Using universal tools (rclone recommended)

### Use rclone (recommended)

When you have your backup files ready thanks to localbackup, you can easily use rclone to upload
them to a third-party storage like S3 or Google Drive.

It's recommended to create a cron job that synchronizes your local backup folder with your remote
storage. For example, the following cron expression will run every day at 2:00 PM and use rclone
for this purpose:

```console
0 14 * * * rclone sync /path/to/local-backups remote:/path/to/destination
```

- rclone docs: https://rclone.org/docs/
- rclone downloads: https://rclone.org/downloads/
- Using rclone on Linux to Automate Backups to Google Drive: https://bit.ly/4049A7u
- Install and Use rclone on Ubuntu: https://bit.ly/3LpCOd4
