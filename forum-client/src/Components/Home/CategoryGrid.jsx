import styles from './HomePage.module.css';
import {Link} from 'react-router-dom'

const categories = [
  { icon: '🖥', name: 'Backend', count: '1.2k', href: '/categories/backend' },
  { icon: '🎨', name: 'Frontend', count: '987', href: '/categories/frontend' },
  { icon: '☁️', name: 'DevOps', count: '654', href: '/categories/devops' },
  { icon: '🔒', name: 'Security', count: '412', href: '/categories/security' },
  { icon: '🗄', name: 'Databases', count: '538', href: '/categories/databases' },
  { icon: '📱', name: 'Mobile', count: '321', href: '/categories/mobile' },
  { icon: '🤖', name: 'AI / ML', count: '290', href: '/categories/ai-ml' },
  { icon: '🧪', name: 'Testing', count: '178', href: '/categories/testing' },
];

export default function CategoryGrid() {
  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>Categories</h2>
      <div className={styles.categoryGrid}>
        {categories.map(cat => (
          <Link key={cat.name} href={cat.href} className={styles.catCard}>
            <span className={styles.catIcon}>{cat.icon}</span>
            <span className={styles.catName}>{cat.name}</span>
            <span className={styles.catCount}>{cat.count} threads</span>
          </Link>
        ))}
      </div>
    </section>
  );
}