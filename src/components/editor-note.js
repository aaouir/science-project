import React from 'react'
import { Link } from 'gatsby'
import styles from './editor-note.module.css'

export default function EditorNote({ note }) {
  if (!note) return null

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.label}>
          <span className={styles.labelDot}>✦</span>
          كلمة المدير
        </div>
        <blockquote className={styles.quote}>
          <div
            dangerouslySetInnerHTML={{
              __html: note.description.childMarkdownRemark.html,
            }}
          />
        </blockquote>
        <div className={styles.footer}>
          <time className={styles.date}>{note.publishDate}</time>
          <Link to={`/blog/${note.slug}`} className={styles.readMore}>
            قراءة المزيد ←
          </Link>
        </div>
      </div>
    </section>
  )
}
