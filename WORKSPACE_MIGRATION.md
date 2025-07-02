# Lerna to npm Workspaces Migration

This document summarizes the changes made to convert the lit-analyzer repository from Lerna to npm workspaces.

## Changes Made

### 1. Root package.json Updates

- Added `workspaces` configuration pointing to `packages/*`
- Updated scripts to use npm workspace commands instead of Lerna:
  - `bootstrap`: Changed from `npm install --workspaces` to `npm install`
  - `publish`: Updated to use `npm publish --workspaces --access public`
  - `publish:next`: Updated to use `npm publish --workspaces --access public --tag next`
  - `test:watch`: Changed to `npm run test:watch --workspaces`
  - `readme`: Changed to `npm run readme --workspaces`
- Added new workspace-specific scripts:
  - `build:workspaces`: Run build on all workspaces
  - `prepare:workspaces`: Run prepare on all workspaces
- Removed Lerna from devDependencies

### 2. Workspace Dependencies

Updated internal dependencies to use wildcard versions:

- In `packages/ts-lit-plugin/package.json`: `@jarrodek/lit-analyzer: "*"`
- In `packages/vscode-lit-plugin/package.json`: `@jarrodek/lit-analyzer: "*"`

### 3. Removed Lerna Configuration

- Deleted `lerna.json` file

### 4. Fixed Build Issues

#### TypeScript Path Issues

- Updated `packages/vscode-lit-plugin/copy-to-built.js` to look for TypeScript in the root `node_modules` instead of local package `node_modules`

#### Import Fixes

- Fixed glob import in `packages/vscode-lit-plugin/src/test/scripts/mocha-driver.ts` to use named import instead of default import
- Fixed TypeScript error in `packages/ts-lit-plugin/src/decorate-language-service.ts` by adding null checks

#### Package Updates

- Updated `@vscode/vsce` package name (was deprecated `vsce`)

## Benefits of npm Workspaces

1. **Simpler toolchain**: No need for Lerna dependency
2. **Native npm support**: Leverages npm's built-in workspace functionality
3. **Better performance**: npm workspaces can be more efficient for dependency resolution
4. **Reduced complexity**: Fewer configuration files and dependencies

## Testing

- ✅ Build process works: `npm run build`
- ✅ Tests run: `npm run test:headless` (3 pre-existing test failures unrelated to workspace changes)
- ✅ Dependency linking works correctly between workspace packages

## Commands Reference

### Development Commands

```bash
# Install dependencies for all workspaces
npm install

# Build all packages
npm run build

# Run tests
npm run test:headless
npm run test:headful
npm run test

# Lint code
npm run lint

# Format code
npm run prettier:write
```

### Publishing Commands

```bash
# Publish all public packages
npm run publish

# Publish with next tag
npm run publish:next
```

### Workspace-specific Commands

```bash
# Run a command in a specific workspace
npm run build --workspace=packages/lit-analyzer

# Run a command in all workspaces
npm run build --workspaces
```

## Migration Complete

The repository has been successfully migrated from Lerna to npm workspaces while maintaining all existing functionality.
