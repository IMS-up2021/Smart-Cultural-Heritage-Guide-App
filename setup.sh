#!/bin/bash

echo "Initializing project setup..."

rm -rf node_modules package-lock.json

npm install

npm install --save-dev @types/node @types/react @types/react-dom typescript

npm install lucide-react clsx tailwind-merge

echo "Configuration concluded successfully!"
echo ""


echo "Starting site at http://localhost:5173..."
npm run dev
