# Node Serverless Function Packer

A tool to help you installing and packing Node.js dependencies in one go

## Installation

```bash
npm i function-packer
```

## How to use

Options

```bash
Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -z, --zip             output a zip file                              [boolean]
      --zipname         create a zip file with a provided name, cannot used with --random-zipname [string]
      --random-zipname  create a zip file with a random name, cannot used with --zipname [boolean]
  -d, --out-dir         the output directory                 [string] [required]
  -p, --package-json    the filepath of the package json     [string] [required]
```

Simple Example

```bash
# create a zip archive of source code
functionpack -d dist -p package.json --zip
```
