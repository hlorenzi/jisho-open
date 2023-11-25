git fetch
git reset --hard HEAD
git checkout origin/main
git branch -f main origin/main
git checkout main
cd backend
pm2 restart pm2.config.json
cd ..