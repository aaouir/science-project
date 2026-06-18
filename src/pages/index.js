import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'
import Hero from '../components/hero'
import ArticlePreview from '../components/article-preview'
import SectionCard from '../components/section-card'
import EditorNote from '../components/editor-note'
import styles from './index.module.css'

const sections = [
  {
    slug: 'loqaymat',
    name: 'لقيمات',
    desc: 'محتوى علمي خفيف وسهل الهضم لمن يريد البدء',
    icon: '💡',
    color: 'loqaymat',
  },
  {
    slug: 'omk',
    name: 'عمق',
    desc: 'تحليلات معمّقة ومقالات علمية متخصصة',
    icon: '🔬',
    color: 'omk',
  },
  {
    slug: 'qatar',
    name: 'من قطر',
    desc: 'أخبار العلوم والتقنية القادمة من دولة قطر',
    icon: '🌐',
    color: 'qatar',
  },
  {
    slug: 'tahar',
    name: 'تحرٍّ',
    desc: 'نتحقق من صحة الأخبار العلمية المتداولة',
    icon: '🔍',
    color: 'tahar',
  },
  {
    slug: 'sira',
    name: 'سيرة ذاتية',
    desc: 'نستحضر مسيرة العلماء العرب وإسهاماتهم',
    icon: '📖',
    color: 'sira',
  },
  {
    slug: 'momar',
    name: 'معمار',
    desc: 'علوم المواد والهندسة المعمارية والبناء',
    icon: '🏛',
    color: 'momar',
  },
]

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges') || []
    const editorNoteEdges = get(this, 'props.data.editorNote.edges') || []
    const editorNote = editorNoteEdges.length > 0 ? editorNoteEdges[0].node : null

    return (
      <Layout location={this.props.location}>
        <Helmet title={siteTitle} />
        <Hero />
        <EditorNote note={editorNote} />

        <section className={styles.sectionsSection}>
          <div className="wrapper">
            <h2 className="section-headline">الأقسام</h2>
            <div className={styles.sectionsGrid}>
              {sections.map(s => (
                <SectionCard key={s.slug} section={s} />
              ))}
            </div>
          </div>
        </section>

        {posts.length > 0 && (
          <section className={styles.articlesSection}>
            <div className="wrapper">
              <h2 className="section-headline">أحدث المقالات</h2>
              <ul className="article-list">
                {posts.map(({ node }) => (
                  <li key={node.slug}>
                    <ArticlePreview article={node} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </Layout>
    )
  }
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    editorNote: allContentfulBlogPost(
      filter: { tags: { in: ["كلمة المدير"] } }
      sort: { fields: [publishDate], order: DESC }
      limit: 1
    ) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "D MMMM YYYY", locale: "ar")
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulBlogPost(
      sort: { fields: [publishDate], order: DESC }
      limit: 9
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
