import fs from 'node:fs/promises'
import path from 'node:path'

const reportFile = path.resolve('scripts/.cache/images-report.json')
const srcDir = path.resolve('src')

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

async function main() {
  let report
  try {
    report = JSON.parse(await fs.readFile(reportFile, 'utf8'))
  } catch {
    console.error('No image report found. Run `npm run generate:images` first.')
    process.exit(1)
  }

  const removed = report.removed ?? []
  const renamed = report.renamed ?? []
  const removedKeys = new Set(removed)
  for (const item of renamed) removedKeys.add(item.from)

  if (removedKeys.size === 0) {
    console.log('No removed keys to check.')
    return
  }

  const files = (await walk(srcDir)).filter((file) =>
    /\.(ts|tsx|js|jsx)$/.test(file),
  )

  const hits = []
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    for (const key of removedKeys) {
      const [group, name] = key.split('.')
      const needle = `icons.${group}.${name}`
      if (content.includes(needle)) {
        hits.push({ file, key: needle })
      }
    }
  }

  if (!hits.length) {
    console.log('No usages found for removed keys.')
    return
  }

  console.log('Found usages of removed keys:')
  for (const hit of hits) {
    console.log(`- ${path.relative(process.cwd(), hit.file)} -> ${hit.key}`)
  }
  process.exit(1)
}

main()
