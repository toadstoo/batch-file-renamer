import fs from 'fs/promises';
import path from 'path';


function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dir: './files',
    prefix: '',
    suffix: '',
    replace: null,
    with: '',
    case: null, // 'lower', 'upper', 'kebab', 'snake'
    numbering: false,
    pad: 3,
    startNum: 1,
    ext: null,
    dryRun: false,
    recursive: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dir' || arg === '-d') options.dir = args[++i];
    else if (arg === '--prefix' || arg === '-p') options.prefix = args[++i];
    else if (arg === '--suffix' || arg === '-s') options.suffix = args[++i];
    else if (arg === '--replace' || arg === '-r') options.replace = args[++i];
    else if (arg === '--with' || arg === '-w') options.with = args[++i] || '';
    else if (arg === '--case' || arg === '-c') options.case = args[++i];
    else if (arg === '--numbering' || arg === '-n') options.numbering = true;
    else if (arg === '--pad') options.pad = parseInt(args[++i], 10) || 3;
    else if (arg === '--start') options.startNum = parseInt(args[++i], 10) || 1;
    else if (arg === '--ext' || arg === '-e') options.ext = args[++i];
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--recursive') options.recursive = true;
    else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

function transformCase(text, caseType) {
  switch (caseType) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'kebab':
      return text.trim().replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

async function getFiles(dir, recursive = false) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`Не удалось прочитать папку "${dir}": ${err.message}`);
  }

  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile()) {
      files.push(fullPath);
    } else if (entry.isDirectory() && recursive) {
      const nested = await getFiles(fullPath, recursive);
      files = files.concat(nested);
    }
  }
  return files;
}

async function main() {
  const options = parseArgs();
  const targetDir = path.resolve(process.cwd(), options.dir);

  console.log(`\n Сканирование папки: ${targetDir}`);
  if (options.dryRun) {
    console.log(' Режим: DRY RUN (тестовый запуск, файлы не будут изменены)\n');
  }

  try {
    const files = await getFiles(targetDir, options.recursive);

    const filteredFiles = files.filter((filePath) => {
      if (!options.ext) return true;
      const targetExt = options.ext.startsWith('.') ? options.ext : `.${options.ext}`;
      return path.extname(filePath).toLowerCase() === targetExt.toLowerCase();
    });

    if (filteredFiles.length === 0) {
      console.log(' Подходящие файлы для переименования не найдены.');
      return;
    }

    console.log(`Найдено файлов для обработки: ${filteredFiles.length}\n`);

    let currentNum = options.startNum;
    let renamedCount = 0;

    for (const filePath of filteredFiles) {
      const dirName = path.dirname(filePath);
      const ext = path.extname(filePath);
      let baseName = path.basename(filePath, ext);

      if (options.replace !== null) {
        try {
          const regex = new RegExp(options.replace, 'g');
          baseName = baseName.replace(regex, options.with);
        } catch {
          baseName = baseName.split(options.replace).join(options.with);
        }
      }

      if (options.case) {
        baseName = transformCase(baseName, options.case);
      }

      if (options.prefix) {
        baseName = `${options.prefix}${baseName}`;
      }
      if (options.suffix) {
        baseName = `${baseName}${options.suffix}`;
      }

      if (options.numbering) {
        const numStr = String(currentNum).padStart(options.pad, '0');
        baseName = `${numStr}_${baseName}`;
        currentNum++;
      }

      const newFileName = `${baseName}${ext}`;
      const newFilePath = path.join(dirName, newFileName);

      if (filePath !== newFilePath) {
        console.log(`  ${path.basename(filePath)}  ➔  ${newFileName}`);
        if (!options.dryRun) {
          await fs.rename(filePath, newFilePath);
        }
        renamedCount++;
      }
    }

    console.log(`\n Готово! Всего переименовано: ${renamedCount} файлов.`);
  } catch (error) {
    console.error(`\n Ошибка: ${error.message}`);
    process.exit(1);
  }
}

main();

    case 'snake':
      return text.trim().replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
    default:
      return text;
  }
}
