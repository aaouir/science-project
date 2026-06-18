import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'
import styles from './section.module.css'

const sectionMeta = {
  loqaymat: { color: 'loqaymat', icon: '💡' },
  omk:      { color: 'omk',      icon: '🔬' },
  qatar:    { color: 'qatar',    icon: '🌐' },
  tahar:    { color: 'tahar',    icon: '🔍' },
  sira:     { color: 'sira',     icon: '📖' },
  momar:    { color: 'momar',    icon: '🏛' },
}

class SectionTemplate extends React.Component {
  render() {
    const { name, slug } = this.props.pageContext
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges') || []
    const meta = sectionMeta[slug] || {}

    return (
      <Layout>
        <Helmet title={`${name} | ${siteTitle}`} />
        <div className={`${styles.hero} ${styles[`hero_${meta.color}`]}`}>
          <span className={styles.heroIcon}>{meta.icon}</span>
          <h1 className={styles.heroTitle}>{name}</h1>
          <p className={styles.heroCount}>{posts.length} مقالة</p>
        </div>
        <div className="wrapper">
          {posts.length > 0 ? (
            <ul className="article-list">
              {posts.map(({ node }) => (
                <li key={node.slug}>
                  <ArticlePreview article={node} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>لا توجد مقالات في هذا القسم بعد.</p>
          )}
        </div>
      </Layout>
    )
  }
}

export default SectionTemplate

export const pageQuery = graphql`
  query SectionQuery($tag: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulBlogPost(
      filter: { tags: { in: [$tag] } }
      sort: { fields: [publishDate], order: DESC }
    ) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "D MMMM YYYY", locale: "ar")
          tags
          heroImage {
            fluid(maxWidth: 560, maxHeight: 315, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`
