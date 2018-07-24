const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

let ID = 0

function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8')

  const ast = babylon.parse(content, {
    sourceType: 'module',
  })

  const dependencies = []

  traverse(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value)
    }
  })

  const id = ID++

  const {code} = transformFromAst(ast, null, {
    presets: ['env'],
  })

  return {
    id,
    filename,
    dependencies,
    code,
  }
}

