import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategories, getThreadsByCategory } from '../../services/api';
import styles from './CategoryDetail.module.css';

const avatarColors = ['blue', 'teal', 'purple', 'amber', 'coral'];

const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  getCategories()
    .then(data => {
      if (!Array.isArray(data)) { setError('Failed to load.'); return; }
      const found = data.find(c =>
        c.name.toLowerCase().replace(' / ', '-') === slug
      );
      if (!found) { setError('Category not found.'); return; }
      setCategory(found);
      return getThreadsByCategory(found.id);
    })
    .then(data => {
      if (!data) return;
      // handle both paginated and plain array responses
      if (Array.isArray(data)) setThreads(data);
      else if (data.threads) setThreads(data.threads);
    })
    .catch(() => setError('Could not connect to the server.'))
    .finally(() => setLoading(false));
}, [slug]);
  if (loading) return <div className={styles.state}>Loading...</div>;
  if (error) return <div className={styles.stateError}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/categories">Categories</Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.icon}>{category.icon}</span>
            <div>
              <h1 className={styles.title}>{category.name}</h1>
              <p className={styles.description}>{category.description}</p>
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{category.threadCount}</span>
              <span className={styles.statLabel}>threads</span>
            </div>
          </div>
        </div>

        {/* Thread list */}
        <div className={styles.threadSection}>
          <div className={styles.threadHeader}>
            <h2 className={styles.threadTitle}>Threads</h2>
            <Link to="/new-thread" className={styles.btnPrimary}>New Thread</Link>
          </div>

          {threads.length === 0 ? (
            <div className={styles.empty}>
              No threads in this category yet.{' '}
              <Link to="/new-thread">Be the first to post!</Link>
            </div>
          ) : (
            <div className={styles.threadList}>
              {threads.map(thread => (
                <Link
                  key={thread.id}
                  to={`/thread/${thread.id}`}
                  className={styles.thread}
                >
                  <div className={`${styles.avatar} ${styles[`avatar_${getAvatarColor(thread.id)}`]}`}>
                    {thread.authorUsername.slice(0, 2).toUpperCase()}
                  </div>

                  <div className={styles.threadMain}>
                    <p className={styles.threadTitle2}>{thread.title}</p>
                    <div className={styles.threadMeta}>
                      {thread.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                      {thread.isSolved && (
                        <span className={styles.solved}>Solved</span>
                      )}
                      <span className={styles.metaText}>
                        by {thread.authorUsername} · {timeAgo(thread.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.threadStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statNum2}>{thread.replyCount}</span>
                      <span className={styles.statLabel}>replies</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNum2}>
                        {thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}k` : thread.views}
                      </span>
                      <span className={styles.statLabel}>views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}