import React from 'react'
import { Link } from 'gatsby'
import './base.css'
import Navigation from './navigation'
import styles from './layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.site}>
      <Navigation />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerLogo}>
            <span>نقطة</span>
            <span className={styles.footerDot}>·</span>
          </Link>
          <p className={styles.footerTagline}>مجلة علمية عربية — علم في متناول الجميع</p>
          <nav className={styles.footerNav}>
            <Link to="/section/loqaymat/">لقيمات</Link>
            <Link to="/section/omk/">عمق</Link>
            <Link to="/section/qatar/">من قطر</Link>
            <Link to="/section/tahar/">تحرٍّ</Link>
            <Link to="/section/sira/">سيرة ذاتية</Link>
            <Link to="/section/momar/">معمار</Link>
          </nav>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} مجلة نقطة العلمية
          </p>
        </div>
      </footer>
    </div>
  )
}
