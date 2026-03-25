import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

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
            placeholder="Search threads... (press Enter)"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/">Home</Link>
          <Link className={styles.navLink} to="/categories">Categories</Link>
          <Link className={styles.navLink} to="/tags">Tags</Link>
          <Link className={styles.navLink} to="/leaderboard">Top Users</Link>
        </nav>

        <div className={styles.actions}>
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

          {user ? (
            <>
              <Link to="/new-thread">
                <button className={styles.btnPrimary}>New Thread</button>
              </Link>
              <div className={styles.userMenu}>
                <button
                  className={styles.userBtn}
                  onClick={() => setDropdownOpen(o => !o)}
                >
                  <div className={styles.userAvatar}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.username}</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.username}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                      </svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className={styles.btnOutline}>Log in</button>
              </Link>
              <Link to="/register">
                <button className={styles.btnPrimary}>Register</button>
              </Link>
            </>
          )}
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
            {user ? (
              <button className={styles.btnOutline} onClick={handleLogout}>Log out</button>
            ) : (
              <>
                <Link to="/login"><button className={styles.btnOutline}>Log in</button></Link>
                <Link to="/register"><button className={styles.btnPrimary}>Register</button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}