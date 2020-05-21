import remark from 'remark'
import remark2rehype from 'remark-rehype'
import prism from '@mapbox/rehype-prism'
import raw from 'rehype-raw'
import sanitize from 'rehype-sanitize'
import html from 'rehype-stringify'
import githubSchema from 'hast-util-sanitize/lib/github.json'
import visit from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import toString from 'mdast-util-to-string'

const ABSOLUTE_URL = /^https?:\/\/|^\/\//i
const slugger = new GithubSlugger()

githubSchema.attributes['*'].push('className')
githubSchema.tagNames.push('video')
githubSchema.attributes['video'] = ['src']

const handlers = {
  inlineCode(_, node) {
    return {
      ...node,
      type: 'element',
      tagName: 'code',
      properties: { className: 'inline' },
      children: [
        {
          type: 'text',
          value: node.value
        }
      ]
    }
  }
}

const visitSectionTitle = node => {
  const text = toString(node)

  if (!text) return

  const id = slugger.slug(text)

  node.properties.id = id

  node.children = [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${id}`
      },
      children: node.children
    }
  ]
}

const visitVideo = node => {
  node.properties.loop = true
  node.properties.muted = true
  node.properties.autoPlay = true
  node.properties.playsInline = true
}

const visitAnchor = node => {
  const isAbsolute = ABSOLUTE_URL.test(node.properties?.href)

  if (isAbsolute) {
    node.properties.target = '_blank'
    node.properties.rel = 'noopener noreferrer'
  }
}

const custom = () => tree => {
  visit(tree, node => node.tagName === 'video', visitVideo)
  visit(tree, node => node.tagName === 'a', visitAnchor)
  visit(tree, node => node.tagName === 'h3', visitSectionTitle)
}

const markdownToHtml = async markdown => {
  try {
    const file = await remark()
      .use(remark2rehype, { handlers, allowDangerousHTML: true })
      .use(raw)
      .use(sanitize, githubSchema)
      .use(prism)
      .use(html)
      .use(custom)
      .process(markdown)

    return file.contents
  } catch (error) {
    console.log(`Markdown to HTML error: ${error}`)
    throw error
  }
}

export default markdownToHtml
