import { mdxAnnotations } from 'mdx-annotations'
import { visit } from 'unist-util-visit'
import rehypeMdxTitle from 'rehype-mdx-title'
import {
  createHighlighter,
  createCssVariablesTheme,
  getSingletonHighlighter,
} from 'shiki'
import { toString } from 'mdast-util-to-string'
import * as acorn from 'acorn'
import { slugifyWithCounter } from '@sindresorhus/slugify'

function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && node.properties.className) {
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          ''
        )
      }
    })
  }
}

function rehypeShiki() {
  return async (tree) => {
    const cssTheme = createCssVariablesTheme({
      name: 'css-variables',
      variablePrefix: '--shiki-',
      variableDefaults: {},
      fontStyle: true,
    })

    const highlighter = await getSingletonHighlighter({
      themes: [cssTheme],
      langs: [
        'javascript',
        'typescript',
        'php',
        'python',
        'ruby',
        'shellscript',
        'csharp',
        'text',
        'java',
        'kotlin',
        'terraform',
        'make',
        'hcl',
        'dart',
        'go',
        'yaml',
        'bicep',
        'dockerfile',
        'json',
        'prisma',
        'toml',
        'graphql',
      ],
    })

    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        let codeNode = node.children[0]
        let textNode = codeNode.children[0]

        node.properties.code = textNode.value

        if (node.properties.language) {
          textNode.value = highlighter.codeToHtml(textNode.value, {
            lang: node.properties.language,
            theme: 'css-variables',
          })
        }
      }
    })
  }
}

function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && child.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  rehypeMdxTitle,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join()}]`,
    }),
  ],
]
