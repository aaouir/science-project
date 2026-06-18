import React from 'react'
import { Link } from 'gatsby'
import styles from './section-card.module.css'

export default function SectionCard({ section }) {
  return (
    <Link
      to={`/section/${section.slug}/`}
      className={`${styles.card} ${styles[`card_${section.color}`]}`}
    >
      <div className={styles.icon} aria-hidden="true">{section.icon}</div>
      <h3 className={styles.name}>{section.name}</h3>
      <p className={styles.desc}>{section.desc}</p>
      <span className={styles.arrow}>←</span>
    </Link>
  )
}
