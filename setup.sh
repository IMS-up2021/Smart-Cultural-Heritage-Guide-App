echo "Limpando instalações antigas..."
rm -rf node_modules package-lock.json

echo "Instalando dependências do projeto..."
npm install

echo "Instalando tipos de TypeScript e dependências de build..."
npm install --save-dev @types/node @types/react @types/react-dom typescript

echo "Instalando dependências do Shadcn UI (comuns)..."
npm install lucide-react clsx tailwind-merge