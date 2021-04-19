#!/bin/sh

# prepends the repo name to all absolute paths to work with github pages

PREFIX_NAME=essem.js

sed -i "/\"\/$PREFIX_NAME/! s/\"\//\"\/$PREFIX_NAME\//g" ./**/*.html  ./**/*.js
