#!/bin/bash

echo "🚀 Modernizing lit-analyzer monorepo..."

echo "📦 Installing modern dependencies..."
npm install

echo "🔧 Setting up Husky..."
npx husky install

echo "🏗️ Building packages..."
npm run build

echo "🧪 Running tests..."
npm test

echo "✨ Formatting code..."
npm run prettier:write

echo "🔍 Linting code..."
npm run lint

echo "✅ Modernization complete!"
echo ""
echo "🔥 Key improvements made:"
echo "   • Updated to TypeScript 5.6"
echo "   • Modern ESLint 9 with flat config"
echo "   • Updated Prettier 3.3"
echo "   • Modern Husky 9 setup"
echo "   • Added npm workspaces support"
echo "   • Added GitHub Actions CI/CD"
echo "   • Updated all dependencies to latest"
echo "   • Added Node.js 18+ requirement"
echo "   • Improved TypeScript configuration"
echo ""
echo "📝 Next steps:"
echo "   1. Review and test the updated configuration"
echo "   2. Update individual package dependencies"
echo "   3. Consider migrating from Lerna to npm workspaces"
echo "   4. Update any custom scripts for new tooling"
