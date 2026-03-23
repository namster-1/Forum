import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Forum</span>
        </Link>

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
          <Link className={styles.navLink} to="/">Home</Link>
          <Link className={styles.navLink} to="/categories">Categories</Link>
          <Link className={styles.navLink} to="/tags">Tags</Link>
          <Link className={styles.navLink} to="/leaderboard">Top Users</Link>
        </nav>

        <div className={styles.actions}>
          <button className={styles.btnOutline}>Log in</button>
          <Link to="/new-thread">
            <button className={styles.btnPrimary}>New Thread</button>
          </Link>
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
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/tags">Tags</Link>
          <Link to="/leaderboard">Top Users</Link>
          <div className={styles.mobileBtns}>
            <button className={styles.btnOutline}>Log in</button>
            <button className={styles.btnPrimary}>New Thread</button>
          </div>
        </div>
      )}
    </header>
  );
}