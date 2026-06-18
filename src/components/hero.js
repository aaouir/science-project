import React from 'react'
import styles from './hero.module.css'

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroLogo}>
          <span className={styles.heroLogoText}>نقطة</span>
          <span className={styles.heroLogoDot}>·</span>
        </div>
        <p className={styles.heroTagline}>مجلة علمية عربية</p>
        <p className={styles.heroDesc}>نستكشف العلم بأسلوب عربي أصيل — من القطر ومن العالم</p>
      </div>
      <div className={styles.heroDecor} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
