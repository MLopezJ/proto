#!/bin/bash

set -e
set -x

npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/nrfCloud ./nrfCloud
npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/hello ./hello
npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/validator ./validator
npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/generate ./generate
npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/fingerprint ./fingerprint
cp -r ./schemas ./dist
mkdir ./dist/nrfcloud-application-protocols
cp -r ./nrfcloud-application-protocols/schemas ./dist/nrfcloud-application-protocols
