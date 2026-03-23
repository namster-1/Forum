import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>DevForum</span>
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
          {/* Theme toggle */}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
          </button>
            <Link to="/login">
            <button className={styles.btnOutline}>Log in</button>
            </Link>
          
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