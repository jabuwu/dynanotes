rm -rf build
rm -f dynanotes.zip
mkdir build
cp package.json build/
(cd build && npm install --production)
npx tsc
(cd build && zip -r ../dynanotes.zip *)