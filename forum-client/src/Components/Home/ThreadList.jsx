import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getThreads } from '../../services/api';
import styles from './HomePage.module.css';

const tabs = ['Latest', 'Hot', 'Unanswered'];
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

export default function ThreadList() {
  const [activeTab, setActiveTab] = useState('Latest');
  const [threads, setThreads] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getThreads(page)
      .then(data => {
        if (data.threads) {
          setThreads(data.threads);
          setTotalPages(data.totalPages);
        } else setError('Failed to load threads.');
      })
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = threads.filter(t => {
    if (activeTab === 'Unanswered') return t.replyCount === 0;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (activeTab === 'Hot') return b.replyCount - a.replyCount;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section className={styles.threadSection}>
      <div className={styles.threadHeader}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className={styles.threadCount}>{sorted.length} threads</span>
      </div>

      {loading && <div className={styles.state}>Loading threads...</div>}
      {error && <div className={styles.stateError}>{error}</div>}

      {!loading && !error && sorted.length === 0 && (
        <div className={styles.state}>No threads yet. Be the first to post!</div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <>
          <div className={styles.threadList}>
            {sorted.map(thread => (
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

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}