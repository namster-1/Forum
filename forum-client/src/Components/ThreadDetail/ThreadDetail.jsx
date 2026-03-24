import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getThread, createReply, voteReply, acceptReply, markThreadSolved } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import styles from './ThreadDetail.module.css';

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function ThreadDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    getThread(id)
      .then(data => {
        if (data.id) setThread(data);
        else setError('Thread not found.');
      })
      .catch(() => setError('Could not connect to the server.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async (replyId, direction) => {
    if (!user) return navigate('/login');
    const data = await voteReply(replyId, direction);
    setThread(t => ({
      ...t,
      replies: t.replies.map(r =>
        r.id === replyId ? { ...r, votes: data.votes } : r
      )
    }));
  };

  const handleAccept = async (replyId) => {
    if (!user) return navigate('/login');
    const data = await acceptReply(replyId);
    setThread(t => ({
      ...t,
      replies: t.replies.map(r =>
        r.id === replyId ? { ...r, isAccepted: data.isAccepted } : r
      )
    }));
  };

  const handleSolve = async () => {
    if (!user) return navigate('/login');
    const data = await markThreadSolved(id);
    setThread(t => ({ ...t, isSolved: data.isSolved }));
  };

  const handleSubmitReply = async () => {
    if (!user) return navigate('/login');
    if (!replyText.trim()) {
      setReplyError('Reply cannot be empty.');
      return;
    }
    setReplyLoading(true);
    setReplyError('');
    try {
      const newReply = await createReply({ content: replyText, threadId: parseInt(id) });
      setThread(t => ({ ...t, replies: [...t.replies, newReply] }));
      setReplyText('');
    } catch {
      setReplyError('Failed to post reply. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) return <div className={styles.state}>Loading thread...</div>;
  if (error) return <div className={styles.stateError}>{error}</div>;
  if (!thread) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{thread.categoryName}</span>
          <span>/</span>
          <span>Thread</span>
        </div>

        {/* Thread header */}
        <div className={styles.threadHeader}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{thread.title}</h1>
            {thread.isSolved && <span className={styles.solvedBadge}>Solved</span>}
          </div>
          <div className={styles.threadMeta}>
            {thread.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            <span className={styles.metaText}>asked by</span>
            <span className={styles.metaAuthor}>{thread.authorUsername}</span>
            <span className={styles.metaText}>· {timeAgo(thread.createdAt)}</span>
            <span className={styles.metaText}>· {thread.views} views</span>
            {user && (
              <button className={styles.solveBtn} onClick={handleSolve}>
                {thread.isSolved ? 'Mark Unsolved' : 'Mark Solved'}
              </button>
            )}
          </div>
        </div>

        {/* Original post */}
        <div className={styles.post}>
          <div className={styles.postSidebar}>
            <div className={styles.avatar}>
              {thread.authorUsername.slice(0, 2).toUpperCase()}
            </div>
            <span className={styles.authorName}>{thread.authorUsername}</span>
          </div>
          <div className={styles.postContent}>
            {thread.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Replies */}
        <div className={styles.repliesSection}>
          <h2 className={styles.repliesTitle}>
            {thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {thread.replies.map(reply => (
            <div
              key={reply.id}
              className={`${styles.reply} ${reply.isAccepted ? styles.replyAccepted : ''}`}
            >
              {reply.isAccepted && (
                <div className={styles.acceptedLabel}>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path fillRule="evenodd" d="M16.704 5.296a1 1 0 00-1.414 0L8 12.586 4.71 9.296a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd"/>
                  </svg>
                  Accepted answer
                </div>
              )}

              <div className={styles.replyInner}>
                <div className={styles.voteSidebar}>
                  <button className={styles.voteBtn} onClick={() => handleVote(reply.id, 'up')}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <span className={styles.voteCount}>{reply.votes}</span>
                  <button className={styles.voteBtn} onClick={() => handleVote(reply.id, 'down')}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  {user && (
                    <button
                      className={`${styles.acceptBtn} ${reply.isAccepted ? styles.acceptBtnActive : ''}`}
                      onClick={() => handleAccept(reply.id)}
                      title="Accept this answer"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path fillRule="evenodd" d="M16.704 5.296a1 1 0 00-1.414 0L8 12.586 4.71 9.296a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  )}
                </div>

                <div className={styles.replyBody}>
                  <div className={styles.replyMeta}>
                    <div className={styles.avatar}>
                      {reply.authorUsername.slice(0, 2).toUpperCase()}
                    </div>
                    <span className={styles.authorName}>{reply.authorUsername}</span>
                    <span className={styles.metaText}>· {timeAgo(reply.createdAt)}</span>
                  </div>
                  <div className={styles.replyContent}>
                    {reply.content.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        <div className={styles.replyBox}>
          <h2 className={styles.repliesTitle}>Your Reply</h2>
          {!user && (
            <p className={styles.loginPrompt}>
              <Link to="/login">Log in</Link> to post a reply.
            </p>
          )}
          {user && (
            <>
              <textarea
                className={styles.textarea}
                placeholder="Write your reply... (markdown supported)"
                value={replyText}
                onChange={e => {
                  setReplyText(e.target.value);
                  setReplyError('');
                }}
                rows={6}
              />
              {replyError && <span className={styles.replyErrorMsg}>{replyError}</span>}
              <div className={styles.replyActions}>
                <span className={styles.metaText}>Be helpful, be kind, stay on topic.</span>
                <button
                  className={styles.btnPrimary}
                  onClick={handleSubmitReply}
                  disabled={replyLoading}
                >
                  {replyLoading ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}