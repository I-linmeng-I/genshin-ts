#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const CHANGELOG_EN = 'Changelog.md'
const CHANGELOG_ZH = 'Changelog_ZH.md'

// Match version heading: ## v0.2.0, ## 0.2.0, ## [0.2.0], etc.
const VERSION_HEADING_RE = /^#{1,6}\s+.*?(\d+\.\d+\.\d+)/

function parseVersionFromLine(line) {
  const match = VERSION_HEADING_RE.exec(line)
  return match ? match[1] : null
}

function extractVersion(content) {
  for (const line of content.split('\n')) {
    const ver = parseVersionFromLine(line)
    if (ver) return ver
  }
  return null
}

function extractSection(content, version) {
  const lines = content.split('\n')
  let inSection = false
  const result = []

  for (const line of lines) {
    const lineVersion = parseVersionFromLine(line)

    if (lineVersion) {
      if (inSection) break
      if (lineVersion === version) inSection = true
    } else if (inSection) {
      result.push(line)
    }
  }

  return result.join('\n').trim()
}

function tagExists(tag) {
  try {
    const result = execSync(`git ls-remote --tags origin refs/tags/${tag}`, { encoding: 'utf-8' })
    return result.trim().length > 0
  } catch {
    return false
  }
}

function main() {
  if (!existsSync(CHANGELOG_EN) || !existsSync(CHANGELOG_ZH)) {
    console.log('Changelog files not found, skipping release')
    process.exit(0)
  }

  const enContent = readFileSync(CHANGELOG_EN, 'utf-8')
  const zhContent = readFileSync(CHANGELOG_ZH, 'utf-8')

  const version = extractVersion(enContent)
  if (!version) {
    console.log('No version found in Changelog.md')
    process.exit(0)
  }

  const tag = `v${version}`
  console.log(`Found version: ${version}`)

  if (tagExists(tag)) {
    console.log(`Tag ${tag} already exists, skipping release`)
    process.exit(0)
  }

  const enNotes = extractSection(enContent, version)
  const zhNotes = extractSection(zhContent, version)

  let combined = enNotes
  if (zhNotes) {
    combined += '\n\n---\n\n' + zhNotes
  }

  const githubOutput = process.env.GITHUB_OUTPUT
  if (githubOutput) {
    writeFileSync(githubOutput, `version=${version}\ntag=${tag}\n`, { flag: 'a' })
  }

  writeFileSync('release_notes.md', combined)
  console.log('Release notes written to release_notes.md')
  console.log('---')
  console.log(combined)
}

main()
