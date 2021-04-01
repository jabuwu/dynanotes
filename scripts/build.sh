set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )"

# create build folder
rm -rf $DIR/build
mkdir $DIR/build

# build dynanotes
rm -rf $DIR/packages/dynanotes/build
(cd $DIR/packages/dynanotes && npm run build)
cp -r $DIR/packages/dynanotes/build/src $DIR/build/src
cp $DIR/packages/dynanotes/package*.json $DIR/build
(cd $DIR/build && npm install --production)
rm -rf $DIR/build/node_modules/aws-sdk

# build dynanotes-ui
rm -rf $DIR/packages/dynanotes-ui/.next
(cd $DIR/packages/dynanotes-ui && npm run build)
cp -r $DIR/packages/dynanotes-ui/.next $DIR/build
cp -r $DIR/packages/dynanotes-ui/public $DIR/build

# create zip
rm -f $DIR/dynanotes.zip
(cd $DIR/build && zip -r $DIR/dynanotes.zip .next *)
