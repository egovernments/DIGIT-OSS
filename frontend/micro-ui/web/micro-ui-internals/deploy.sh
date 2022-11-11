echo "Switch to branch master"
git checkout master

echo "building app..."
yarn run build

echo "Deploying files to server..."
scp -r build/* root@10.1.1.18:/var/www/10.1.1.18/

echo "Done!"