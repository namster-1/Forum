import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from '../../services/api';
import styles from './Tags.module.css';

const colors = ['blue', 'purple', 'teal', 'coral', 'amber'];

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTags()
      .then(data => {
        if (Array.isArray(data)) setTags(data);
        else setError('Failed to load tags.');
      })
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className={styles.state}>Loading tags...</div>;
  if (error) return <div className={styles.stateError}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Tags</h1>
            <p className={styles.pageSubtitle}>{tags.length} tags — filter threads by topic</p>
          </div>
          <input
            className={styles.search}
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No tags found for "{search}"</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((tag, i) => (
              <Link
                key={tag.id}
                to={`/tags/${tag.name.toLowerCase()}`}
                className={styles.card}
              >
                <div className={`${styles.tagPill} ${styles[`pill_${colors[i % colors.length]}`]}`}>
                  {tag.name}
                </div>
                <p className={styles.threadCount}>
                  {tag.threadCount.toLocaleString()} threads
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}