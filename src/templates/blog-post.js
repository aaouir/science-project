import React from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import styles from './blog-post.module.css'

const sectionMap = {
  'لقيمات': { slug: 'loqaymat' },
  'عمق':    { slug: 'omk' },
  'من قطر': { slug: 'qatar' },
  'تحر':    { slug: 'tahar' },
  'تحرٍّ':  { slug: 'tahar' },
  'سيرة ذاتية': { slug: 'sira' },
  'معمار':  { slug: 'momar' },
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const primaryTag = post.tags && post.tags[0]
    const section = primaryTag && sectionMap[primaryTag]

    return (
      <Layout location={this.props.location}>
        <Helmet title={`${post.title} | ${siteTitle}`} />
        <article>
          {post.heroImage && (
            <div className={styles.hero}>
              <Img
                className={styles.heroImage}
                alt={post.title}
                fluid={post.heroImage.fluid}
              />
            </div>
          )}
          <div className="wrapper">
            <div className={styles.article}>
              <header className={styles.header}>
                {primaryTag && (
                  <Link
                    to={section ? `/section/${section.slug}/` : '/blog/'}
                    className={styles.sectionBadge}
                  >
                    {primaryTag}
                  </Link>
                )}
                <h1 className={styles.title}>{post.title}</h1>
                <time className={styles.date}>{post.publishDate}</time>
              </header>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{
                  __html: post.body.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>
        </article>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "D MMMM YYYY", locale: "ar")
      tags
      heroImage {
        fluid(maxWidth: 1280, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
