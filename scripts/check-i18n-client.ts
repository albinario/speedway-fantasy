// Checks that every translation namespace used by code running in the browser
// is listed in `clientNamespaces` (src/i18n/config.ts), since only those are
// sent to the client. Browser code = 'use client' files plus everything they
// import (a component without the directive still runs on the client when a
// client component imports it).
//
// Usage: bun run i18n:check   (run from the repo root; exits 1 when a
// namespace is missing)
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { clientNamespaces } from '../src/i18n/config'

const root = process.cwd()
const src = join(root, 'src')
const extensions = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

function resolveImport(fromFile: string, specifier: string) {
	const base = specifier.startsWith('@/')
		? join(src, specifier.slice(2))
		: specifier.startsWith('.')
			? resolve(dirname(fromFile), specifier)
			: null
	if (!base) return null

	return (
		extensions
			.map((ext) => base + ext)
			.find((path) => /\.tsx?$/.test(path) && existsSync(path)) ?? null
	)
}

const isDirective = (source: string, directive: string) =>
	new RegExp(`^\\s*['"]${directive}['"]`).test(source)

const entries = readdirSync(src, { recursive: true, encoding: 'utf8' })
	.filter((file) => /\.tsx?$/.test(file))
	.map((file) => join(src, file))
	.filter((file) => isDirective(readFileSync(file, 'utf8'), 'use client'))

// namespace -> files that use it on the client
const used = new Map<string, Set<string>>()
const use = (namespace: string, file: string) =>
	used.set(namespace, (used.get(namespace) ?? new Set()).add(file))

const seen = new Set<string>()
const queue = [...entries]

while (queue.length) {
	const file = queue.pop()!
	if (seen.has(file)) continue
	seen.add(file)

	const source = readFileSync(file, 'utf8')
	// Server actions imported by client code still run on the server
	if (isDirective(source, 'use server')) continue

	for (const [, namespace] of source.matchAll(
		/useTranslations\(\s*['"](\w+)['"]/g
	)) {
		use(namespace, file)
	}

	// Root translator (useTranslations()): read the namespace from each key
	if (/useTranslations\(\s*\)/.test(source)) {
		for (const [, namespace] of source.matchAll(
			/\bt(?:\.rich|\.markup)?\(\s*[`'"](\w+)\./g
		)) {
			use(namespace, file)
		}
	}

	for (const [statement, specifier] of source.matchAll(
		/(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]/g
	)) {
		if (/^(?:import|export)\s+type\s/.test(statement)) continue
		const resolved = resolveImport(file, specifier)
		if (resolved) queue.push(resolved)
	}
}

const listed = new Set<string>(clientNamespaces)
const missing = [...used.keys()].filter((namespace) => !listed.has(namespace))
const unused = [...listed].filter((namespace) => !used.has(namespace))

for (const namespace of missing) {
	const files = [...used.get(namespace)!].map((file) => relative(root, file))
	console.error(
		`✗ '${namespace}' is used on the client but not in clientNamespaces:`
	)
	for (const file of files) console.error(`    ${file}`)
}
for (const namespace of unused) {
	console.warn(
		`! '${namespace}' is in clientNamespaces but no client code uses it`
	)
}

if (missing.length) process.exit(1)
console.log(
	`✓ ${used.size} client namespaces, all listed (${seen.size} files checked)`
)
