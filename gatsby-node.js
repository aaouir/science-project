const path = require('path')

const SECTIONS = [
  { slug: 'loqaymat', name: 'لقيمات', tag: 'لقيمات' },
  { slug: 'omk',      name: 'عمق',    tag: 'عمق' },
  { slug: 'qatar',    name: 'من قطر', tag: 'من قطر' },
  { slug: 'tahar',    name: 'تحرٍّ',  tag: 'تحر' },
  { slug: 'sira',     name: 'سيرة ذاتية', tag: 'سيرة ذاتية' },
  { slug: 'momar',    name: 'معمار',  tag: 'معمار' },
]

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allContentfulBlogPost {
        edges {
          node {
            title
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const blogPost = path.resolve('./src/templates/blog-post.js')
  result.data.allContentfulBlogPost.edges.forEach(({ node }) => {
    createPage({
      path: `/blog/${node.slug}/`,
      component: blogPost,
      context: {
        slug: node.slug,
      },
    })
  })

  const sectionTemplate = path.resolve('./src/templates/section.js')
  SECTIONS.forEach(section => {
    createPage({
      path: `/section/${section.slug}/`,
      component: sectionTemplate,
      context: {
        slug: section.slug,
        name: section.name,
        tag: section.tag,
      },
    })
  })
}
