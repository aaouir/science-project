import React, { useState } from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.css'

const sections = [
  { slug: 'loqaymat', name: 'لقيمات', color: 'loqaymat' },
  { slug: 'omk', name: 'عمق', color: 'omk' },
  { slug: 'qatar', name: 'من قطر', color: 'qatar' },
  { slug: 'tahar', name: 'تحرٍّ', color: 'tahar' },
  { slug: 'sira', name: 'سيرة ذاتية', color: 'sira' },
  { slug: 'momar', name: 'معمار', color: 'momar' },
]

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>نقطة</span>
          <span className={styles.logoDot}>·</span>
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="قائمة"
        >
          <span /><span /><span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} role="navigation">
          <ul className={styles.navList}>
            {sections.map(s => (
              <li key={s.slug} className={styles.navItem}>
                <Link
                  to={`/section/${s.slug}/`}
                  className={styles.navLink}
                  data-section={s.color}
                  activeClassName={styles.navLinkActive}
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li className={styles.navItem}>
              <Link to="/blog/" className={styles.navLink} activeClassName={styles.navLinkActive}>
                جميع المقالات
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
