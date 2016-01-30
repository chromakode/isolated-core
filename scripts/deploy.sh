#!/bin/bash

# based on:
# - https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
# - http://www.steveklabnik.com/automatically_update_github_pages_with_travis_example/

set -o errexit -o nounset

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "Skipping deploy: pull request."
  exit 1
fi

if [ "$TRAVIS_BRANCH" != "master" ]; then
  echo "Skipping deploy: branch not master."
  exit 1
fi

REV=$(git rev-parse --short HEAD)

cd demo
npm install
NODE_ENV=production npm run build
cd build

git init
git config user.name "CI"
git config user.email "chromaci@chromakode.com"

git add -A .
git commit -m "Auto-build of ${REV}"
git push -f "https://${GH_TOKEN}@${GH_REF}" HEAD:gh-pages > /dev/null 2>&1

echo "✔ Deployed successfully."
