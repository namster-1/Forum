import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThreadsByTag } from '../../services/api';
import styles from './TagDetail.module.css';

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

export default function TagDetail() {
  const { slug } = useParams();
  const [threads, setThreads] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getThreadsByTag(slug, page)
      .then(data => {
        if (data.threads) {
          setThreads(data.threads);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else if (data.threads) setThreads(data.threads);
        else setError('Failed to load threads.');
      })
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/tags">Tags</Link>
          <span>/</span>
          <span>{slug}</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.tagPill}>{slug}</span>
            {!loading && (
              <span className={styles.threadCount}>{total} thread{total !== 1 ? 's' : ''}</span>
            )}
          </div>
          <Link to="/new-thread" className={styles.btnPrimary}>New Thread</Link>
        </div>

        {loading && <div className={styles.state}>Loading...</div>}
        {error && <div className={styles.stateError}>{error}</div>}

        {!loading && !error && threads.length === 0 && (
          <div className={styles.empty}>
            <p>No threads tagged with "{slug}" yet.</p>
            <Link to="/new-thread" className={styles.btnPrimary}>Be the first to post!</Link>
          </div>
        )}

        {!loading && !error && threads.length > 0 && (
          <>
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

      </div>
    </div>
  );
}