import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Tags.module.css';

const tags = [
  { id: 1, name: '.NET', threads: 520, color: 'purple' },
  { id: 2, name: 'React', threads: 480, color: 'blue' },
  { id: 3, name: 'PostgreSQL', threads: 390, color: 'teal' },
  { id: 4, name: 'Docker', threads: 340, color: 'blue' },
  { id: 5, name: 'Auth', threads: 310, color: 'coral' },
  { id: 6, name: 'CI/CD', threads: 280, color: 'amber' },
  { id: 7, name: 'Performance', threads: 250, color: 'amber' },
  { id: 8, name: 'Security', threads: 240, color: 'coral' },
  { id: 9, name: 'IIS', threads: 210, color: 'teal' },
  { id: 10, name: 'API Design', threads: 200, color: 'purple' },
  { id: 11, name: 'Kubernetes', threads: 190, color: 'blue' },
  { id: 12, name: 'TypeScript', threads: 185, color: 'blue' },
  { id: 13, name: 'Redis', threads: 170, color: 'coral' },
  { id: 14, name: 'GraphQL', threads: 155, color: 'purple' },
  { id: 15, name: 'Testing', threads: 140, color: 'teal' },
  { id: 16, name: 'DB Design', threads: 135, color: 'amber' },
  { id: 17, name: 'React Native', threads: 120, color: 'blue' },
  { id: 18, name: 'AI / ML', threads: 115, color: 'purple' },
  { id: 19, name: 'Microservices', threads: 110, color: 'teal' },
  { id: 20, name: 'Discussion', threads: 105, color: 'amber' },
  { id: 21, name: 'Git', threads: 98, color: 'coral' },
  { id: 22, name: 'Linux', threads: 94, color: 'teal' },
  { id: 23, name: 'CSS', threads: 88, color: 'purple' },
  { id: 24, name: 'Python', threads: 82, color: 'blue' },
];

export default function Tags() {
  const [search, setSearch] = useState('');

  const filtered = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.map(tag => (
              <Link
                key={tag.id}
                to={`/tags/${tag.name.toLowerCase().replace(' / ', '-').replace(' ', '-')}`}
                className={styles.card}
              >
                <div className={`${styles.tagPill} ${styles[`pill_${tag.color}`]}`}>
                  {tag.name}
                </div>
                <p className={styles.threadCount}>
                  {tag.threads.toLocaleString()} threads
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}