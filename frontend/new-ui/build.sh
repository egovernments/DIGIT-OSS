react-scripts build

statsFile="./build/asset-manifest.json"
indexFile="./build/index.html"

echo "changing stats"
sed -i -e "s|/static|/v2ui/static|g" ${statsFile}

echo "changing index"
sed -i -e "s|/static|/v2ui/static|g" ${indexFile}