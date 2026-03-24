import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';
import styles from './Categories.module.css';

const colors = ['blue', 'purple', 'teal', 'coral', 'amber', 'blue', 'purple', 'teal'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else setError('Failed to load categories.');
      })
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.state}>Loading categories...</div>;
  if (error) return <div className={styles.stateError}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Browse threads by topic</p>
        </div>

        {categories.length === 0 ? (
          <div className={styles.state}>No categories yet.</div>
        ) : (
          <div className={styles.grid}>
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.name.toLowerCase().replace(' / ', '-')}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={styles.icon}>{cat.icon}</span>
                  <span className={`${styles.threadCount} ${styles[`count_${colors[i % colors.length]}`]}`}>
                    {cat.threadCount.toLocaleString()} threads
                  </span>
                </div>
                <h2 className={styles.catName}>{cat.name}</h2>
                <p className={styles.catDesc}>{cat.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.browseLink}>Browse →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}