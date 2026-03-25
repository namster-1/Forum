import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';
import styles from './HomePage.module.css';

const colors = ['blue', 'purple', 'teal', 'coral', 'amber', 'blue', 'purple', 'teal'];

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.state}>Loading categories...</div>;

  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>Categories</h2>
      <div className={styles.categoryGrid}>
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.name.toLowerCase().replace(' / ', '-')}`}
            className={styles.catCard}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            <span className={styles.catName}>{cat.name}</span>
            <span className={styles.catCount}>{cat.threadCount} threads</span>
          </Link>
        ))}
      </div>
    </section>
  );
}