import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const tabs = ['Latest', 'Hot', 'Unanswered', 'My Posts'];

const threads = [
  {
    id: 1,
    title: 'Best practices for JWT refresh token rotation in .NET 8 minimal APIs?',
    author: 'giorgi.k',
    initials: 'GK',
    avatarColor: 'blue',
    tags: ['.NET', 'Auth'],
    solved: true,
    replies: 14,
    views: 342,
    time: '2h ago',
  },
  {
    id: 2,
    title: 'PostgreSQL JSONB vs separate table — when does it actually make sense?',
    author: 'nino.s',
    initials: 'NS',
    avatarColor: 'teal',
    tags: ['PostgreSQL', 'DB Design'],
    solved: false,
    replies: 27,
    views: 891,
    time: '5h ago',
  },
  {
    id: 3,
    title: 'React 19 — is the new compiler actually worth upgrading for in production?',
    author: 'a.turashvili',
    initials: 'AT',
    avatarColor: 'purple',
    tags: ['React', 'Discussion'],
    solved: false,
    replies: 41,
    views: 1400,
    time: '8h ago',
  },
  {
    id: 4,
    title: 'IIS vs Kestrel for hosting .NET APIs — performance benchmarks 2025',
    author: 'm.beridze',
    initials: 'MB',
    avatarColor: 'amber',
    tags: ['.NET', 'IIS', 'Performance'],
    solved: false,
    replies: 19,
    views: 720,
    time: '1d ago',
  },
  {
    id: 5,
    title: 'How are you handling DB migrations in CI/CD? Flyway vs EF Core',
    author: 'dachi.k',
    initials: 'DK',
    avatarColor: 'coral',
    tags: ['PostgreSQL', 'CI/CD'],
    solved: true,
    replies: 33,
    views: 2100,
    time: '2d ago',
  },
];

export default function ThreadList() {
  const [activeTab, setActiveTab] = useState('Latest');

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
        <span className={styles.threadCount}>{threads.length} threads</span>
      </div>

      <div className={styles.threadList}>
        {threads.map(thread => (
          <Link
            key={thread.id}
            to={`/thread/${thread.id}`}
            className={styles.thread}
          >
            <div className={`${styles.avatar} ${styles[`avatar_${thread.avatarColor}`]}`}>
              {thread.initials}
            </div>

            <div className={styles.threadMain}>
              <p className={styles.threadTitle}>{thread.title}</p>
              <div className={styles.threadMeta}>
                {thread.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
                {thread.solved && (
                  <span className={styles.solved}>Solved</span>
                )}
                <span className={styles.metaText}>by {thread.author} · {thread.time}</span>
              </div>
            </div>

            <div className={styles.threadStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{thread.replies}</span>
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
    </section>
  );
}