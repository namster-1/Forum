import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Forum</span>
        </div>

        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search threads, tags, users..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>

        <nav className={styles.nav}>
          <a className={styles.navLink} href="/">Home</a>
          <a className={styles.navLink} href="/categories">Categories</a>
          <a className={styles.navLink} href="/tags">Tags</a>
          <a className={styles.navLink} href="/leaderboard">Top Users</a>
        </nav>

        <div className={styles.actions}>
          <button className={styles.btnOutline}>Log in</button>
          <button className={styles.btnPrimary}>New Thread</button>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/">Home</a>
          <a href="/categories">Categories</a>
          <a href="/tags">Tags</a>
          <a href="/leaderboard">Top Users</a>
          <div className={styles.mobileBtns}>
            <button className={styles.btnOutline}>Log in</button>
            <button className={styles.btnPrimary}>New Thread</button>
          </div>
        </div>
      )}
    </header>
  );
}