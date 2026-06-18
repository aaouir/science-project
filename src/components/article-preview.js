import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import styles from './article-preview.module.css'

const sectionMap = {
  'لقيمات': { slug: 'loqaymat', color: 'loqaymat' },
  'عمق':    { slug: 'omk', color: 'omk' },
  'من قطر': { slug: 'qatar', color: 'qatar' },
  'تحر':    { slug: 'tahar', color: 'tahar' },
  'تحرٍّ':  { slug: 'tahar', color: 'tahar' },
  'سيرة ذاتية': { slug: 'sira', color: 'sira' },
  'معمار':  { slug: 'momar', color: 'momar' },
}

export default function ArticlePreview({ article }) {
  const primaryTag = article.tags && article.tags[0]
  const section = primaryTag && sectionMap[primaryTag]

  return (
    <div className={styles.card}>
      {article.heroImage && (
        <Link to={`/blog/${article.slug}`} className={styles.imageWrap} tabIndex={-1}>
          <Img
            alt={article.title}
            fluid={article.heroImage.fluid}
            className={styles.image}
          />
        </Link>
      )}
      <div className={styles.body}>
        {section && (
          <Link
            to={`/section/${section.slug}/`}
            className={`${styles.tag} ${styles[`tag_${section.color}`]}`}
          >
            {primaryTag}
          </Link>
        )}
        <h3 className={styles.title}>
          <Link to={`/blog/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.description && (
          <div
            className={styles.excerpt}
            dangerouslySetInnerHTML={{
              __html: article.description.childMarkdownRemark.html,
            }}
          />
        )}
        <time className={styles.date}>{article.publishDate}</time>
      </div>
    </div>
  )
}
