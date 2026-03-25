import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getThreads } from '../../services/api';
import styles from './SearchPage.module.css';

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

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [threads, setThreads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    getThreads(1, query)
      .then(data => {
        setThreads(data.threads || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Search results for <span className={styles.query}>"{query}"</span>
          </h1>
          {!loading && (
            <p className={styles.pageSubtitle}>{total} result{total !== 1 ? 's' : ''} found</p>
          )}
        </div>

        {loading && <div className={styles.state}>Searching...</div>}

        {!loading && threads.length === 0 && (
          <div className={styles.empty}>
            <p>No threads found for "{query}"</p>
            <Link to="/new-thread" className={styles.btnPrimary}>
              Ask this question
            </Link>
          </div>
        )}

        {!loading && threads.length > 0 && (
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
                  <p className={styles.threadTitle}>{thread.title}</p>
                  <div className={styles.threadMeta}>
                    <span className={styles.category}>{thread.categoryName}</span>
                    {thread.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                    {thread.isSolved && <span className={styles.solved}>Solved</span>}
                    <span className={styles.metaText}>
                      by {thread.authorUsername} · {timeAgo(thread.createdAt)}
                    </span>
                  </div>
                </div>

                <div className={styles.threadStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{thread.replyCount}</span>
                    <span className={styles.statLabel}>replies</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>
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
  );
}