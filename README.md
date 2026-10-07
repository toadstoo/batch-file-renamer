# Batch File Renamer

A flexible CLI tool to batch rename files with patterns, regex, prefix, suffix, and numbering.

## Usage

```bash
node index.js [options]
```

## Options

| Option | Description |
| :--- | :--- |
| `-d`, `--dir <path>` | Directory containing files (default: './files') |
| `-p`, `--prefix <str>` | Add prefix to filenames |
| `-s`, `--suffix <str>` | Add suffix to filenames |
| `-r`, `--replace <regex>` | Regex or string to find in filename |
| `-w`, `--with <str>` | String to replace with |
| `-c`, `--case <type>` | Transform case (lower, upper, kebab, snake) |
| `-n`, `--numbering` | Add numbering (e.g., 001_filename.ext) |
| `--pad <num>` | Padding for numbering (default: 3) |
| `--start <num>` | Starting number (default: 1) |
| `-e`, `--ext <ext>` | Filter by file extension |
| `--dry-run` | Simulate changes without renaming |
| `--recursive` | Process files recursively in subdirectories |
| `-h`, `--help` | Show help |

## License
MIT
