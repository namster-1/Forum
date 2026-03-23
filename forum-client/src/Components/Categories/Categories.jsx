import { Link } from 'react-router-dom';
import styles from './Categories.module.css';

const categories = [
  { id: 1, icon: '🖥', name: 'Backend', description: 'APIs, servers, databases, architecture and everything behind the scenes.', threads: 1200, color: 'blue' },
  { id: 2, icon: '🎨', name: 'Frontend', description: 'React, Vue, CSS, UI/UX and everything the user sees.', threads: 987, color: 'purple' },
  { id: 3, icon: '☁️', name: 'DevOps', description: 'CI/CD, Docker, Kubernetes, cloud infrastructure and deployments.', threads: 654, color: 'teal' },
  { id: 4, icon: '🔒', name: 'Security', description: 'Auth, encryption, vulnerabilities, best practices and pen testing.', threads: 412, color: 'coral' },
  { id: 5, icon: '🗄', name: 'Databases', description: 'PostgreSQL, MySQL, MongoDB, Redis, query optimization and design.', threads: 538, color: 'amber' },
  { id: 6, icon: '📱', name: 'Mobile', description: 'iOS, Android, React Native, Flutter and cross-platform development.', threads: 321, color: 'blue' },
  { id: 7, icon: '🤖', name: 'AI / ML', description: 'Machine learning, LLMs, data science, model training and inference.', threads: 290, color: 'purple' },
  { id: 8, icon: '🧪', name: 'Testing', description: 'Unit tests, integration tests, E2E, TDD and QA practices.', threads: 178, color: 'teal' },
];

export default function Categories() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Browse threads by topic</p>
        </div>

        <div className={styles.grid}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/categories/${cat.name.toLowerCase().replace(' / ', '-')}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.icon}>{cat.icon}</span>
                <span className={`${styles.threadCount} ${styles[`count_${cat.color}`]}`}>
                  {cat.threads.toLocaleString()} threads
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

      </div>
    </div>
  );
}