import remark from 'remark'
import remark2rehype from 'remark-rehype'
import prism from '@mapbox/rehype-prism'
import raw from 'rehype-raw'
import sanitize from 'rehype-sanitize'
import html from 'rehype-stringify'
import githubSchema from 'hast-util-sanitize/lib/github.json'

githubSchema.attributes['*'].push('className')
githubSchema.tagNames.push('video')
githubSchema.attributes['video'] = [
  'src',
  'autoPlay',
  'muted',
  'playsInline',
  'loop'
]

const handlers = {
  // Add a className to inlineCode so we can differentiate between it and code fragments
  inlineCode(h, node) {
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

const markdownToHtml = async markdown => {
  try {
    const file = await remark()
      .use(remark2rehype, { handlers, allowDangerousHTML: true })
      .use(raw)
      .use(sanitize, githubSchema)
      .use(prism)
      .use(html)
      .process(markdown)

    return file.contents
  } catch (error) {
    console.log(`Markdown to HTML error: ${error}`)
    throw error
  }
}

export default markdownToHtml
