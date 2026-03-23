import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ThreadDetail.module.css';

const mockThread = {
  id: 1,
  title: 'Best practices for JWT refresh token rotation in .NET 8 minimal APIs?',
  author: 'giorgi.k',
  initials: 'GK',
  avatarColor: 'blue',
  tags: ['.NET', 'Auth'],
  solved: true,
  createdAt: '2 hours ago',
  views: 342,
  content: `I'm building a REST API with .NET 8 minimal APIs and I'm trying to figure out the best approach for handling JWT refresh token rotation.

Currently I'm issuing a short-lived access token (15 min) and a longer refresh token (7 days), but I'm not sure how to handle the rotation safely — especially around:

- Should I invalidate the old refresh token immediately after use?
- How do I handle the case where the same refresh token is used twice (token theft detection)?
- Where should I store refresh tokens — database or Redis?

Any advice from people who have done this in production would be really appreciated.`,
};

const mockReplies = [
  {
    id: 1,
    author: 'nino.s',
    initials: 'NS',
    avatarColor: 'teal',
    createdAt: '1 hour ago',
    isAccepted: true,
    votes: 12,
    content: `Great question. Here's what works well in production:

Yes, invalidate the old refresh token immediately after use — this is called refresh token rotation and it's the recommended approach.

For theft detection, keep a "family" ID on each token. If a refresh token that was already used gets submitted again, invalidate the entire family. This means the legitimate user gets logged out too, but that's the safe behavior.

For storage, I'd recommend the database for most cases. Redis is faster but adds operational complexity. PostgreSQL can handle the load for most forum-scale apps easily.`
  },
  {
    id: 2,
    author: 'm.beridze',
    initials: 'MB',
    avatarColor: 'amber',
    createdAt: '45 min ago',
    isAccepted: false,
    votes: 5,
    content: `Also worth looking at the ASP.NET Core Data Protection API if you want a .NET-native approach. It handles a lot of the token lifecycle stuff for you and integrates cleanly with minimal APIs.`
  },
  {
    id: 3,
    author: 'dachi.k',
    initials: 'DK',
    avatarColor: 'coral',
    createdAt: '20 min ago',
    isAccepted: false,
    votes: 2,
    content: `One more thing — make sure your refresh token endpoint is rate limited. Even with rotation, a fast attacker can try to win the race condition. A simple sliding window rate limiter on that endpoint goes a long way.`
  },
];

export default function ThreadDetail() {
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');
  const [votes, setVotes] = useState(
    mockReplies.reduce((acc, r) => ({ ...acc, [r.id]: r.votes }), {})
  );

  const handleVote = (replyId, direction) => {
    setVotes(v => ({ ...v, [replyId]: v[replyId] + direction }));
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    alert('Reply submitted! (will connect to API later)');
    setReplyText('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Thread</span>
        </div>

        {/* Thread header */}
        <div className={styles.threadHeader}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{mockThread.title}</h1>
            {mockThread.solved && (
              <span className={styles.solvedBadge}>Solved</span>
            )}
          </div>
          <div className={styles.threadMeta}>
            {mockThread.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            <span className={styles.metaText}>asked by</span>
            <span className={styles.metaAuthor}>{mockThread.author}</span>
            <span className={styles.metaText}>· {mockThread.createdAt}</span>
            <span className={styles.metaText}>· {mockThread.views} views</span>
          </div>
        </div>

        {/* Original post */}
        <div className={styles.post}>
          <div className={styles.postSidebar}>
            <div className={`${styles.avatar} ${styles[`avatar_${mockThread.avatarColor}`]}`}>
              {mockThread.initials}
            </div>
            <span className={styles.authorName}>{mockThread.author}</span>
          </div>
          <div className={styles.postContent}>
            {mockThread.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Replies */}
        <div className={styles.repliesSection}>
          <h2 className={styles.repliesTitle}>
            {mockReplies.length} {mockReplies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {mockReplies.map(reply => (
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
                {/* Vote sidebar */}
                <div className={styles.voteSidebar}>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(reply.id, 1)}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <span className={styles.voteCount}>{votes[reply.id]}</span>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(reply.id, -1)}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {/* Reply content */}
                <div className={styles.replyBody}>
                  <div className={styles.replyMeta}>
                    <div className={`${styles.avatar} ${styles[`avatar_${reply.avatarColor}`]}`}>
                      {reply.initials}
                    </div>
                    <span className={styles.authorName}>{reply.author}</span>
                    <span className={styles.metaText}>· {reply.createdAt}</span>
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
          <textarea
            className={styles.textarea}
            placeholder="Write your reply... (markdown supported)"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={6}
          />
          <div className={styles.replyActions}>
            <span className={styles.metaText}>Be helpful, be kind, stay on topic.</span>
            <button
              className={styles.btnPrimary}
              onClick={handleSubmitReply}
            >
              Post Reply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}