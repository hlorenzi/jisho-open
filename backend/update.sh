cd ..
git fetch
git reset --hard HEAD
git checkout origin/main
git branch -f main origin/main
git checkout main
cd frontend
npm install
npm run build
cd ..
cd backend
npm install
pm2 restart pm2.config.json
cd ..