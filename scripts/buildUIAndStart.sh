#!/usr/bin/env bash

THEME=./data/theme.js
EN=./data/en.js
DE=./data/de.js

if test -f "$THEME"; then
    cp ./data/theme.js ./src/web/src/style/customTheme.js
fi

if test -f "$EN"; then
    cp ./data/en.js ./src/web/src/languages/en.js
fi

if test -f "$DE"; then
    cp ./data/de.js ./src/web/src/languages/de.js
fi

cd ./src/web/
npm install
./compile

cd ../../
node ./src/app.js
