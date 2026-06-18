import React from 'react'
import styles from './hero.module.css'

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroLogo}>
          <img src="/logo-nokta.svg" alt="نقطة" className={styles.heroLogoImg} />
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
