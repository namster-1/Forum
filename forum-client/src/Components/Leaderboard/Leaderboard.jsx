import { useState } from 'react';
import styles from './Leaderboard.module.css';

const users = [
  { id: 1, initials: 'NS', name: 'nino.s', avatarColor: 'teal', threads: 84, replies: 312, accepted: 98, joined: 'Jan 2024' },
  { id: 2, initials: 'GK', name: 'giorgi.k', avatarColor: 'blue', threads: 72, replies: 280, accepted: 85, joined: 'Feb 2024' },
  { id: 3, initials: 'AT', name: 'a.turashvili', avatarColor: 'purple', threads: 65, replies: 241, accepted: 76, joined: 'Mar 2024' },
  { id: 4, initials: 'MB', name: 'm.beridze', avatarColor: 'amber', threads: 58, replies: 198, accepted: 61, joined: 'Jan 2024' },
  { id: 5, initials: 'DK', name: 'dachi.k', avatarColor: 'coral', threads: 49, replies: 175, accepted: 54, joined: 'Apr 2024' },
  { id: 6, initials: 'LM', name: 'luka.m', avatarColor: 'blue', threads: 43, replies: 160, accepted: 48, joined: 'May 2024' },
  { id: 7, initials: 'TG', name: 't.giorgi', avatarColor: 'teal', threads: 38, replies: 142, accepted: 40, joined: 'Mar 2024' },
  { id: 8, initials: 'AK', name: 'ani.k', avatarColor: 'purple', threads: 31, replies: 128, accepted: 35, joined: 'Jun 2024' },
  { id: 9, initials: 'BJ', name: 'beka.j', avatarColor: 'coral', threads: 27, replies: 110, accepted: 29, joined: 'Jul 2024' },
  { id: 10, initials: 'SK', name: 's.kvaratskhelia', avatarColor: 'amber', threads: 22, replies: 94, accepted: 24, joined: 'Aug 2024' },
];

const tabs = ['Replies', 'Threads', 'Accepted'];

const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Replies');

  const sorted = [...users].sort((a, b) => {
    if (activeTab === 'Replies') return b.replies - a.replies;
    if (activeTab === 'Threads') return b.threads - a.threads;
    if (activeTab === 'Accepted') return b.accepted - a.accepted;
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Top Users</h1>
            <p className={styles.pageSubtitle}>The most active members of the community</p>
          </div>
        </div>

        {/* Top 3 podium */}
        <div className={styles.podium}>
          {sorted.slice(0, 3).map((user, i) => (
            <div key={user.id} className={`${styles.podiumCard} ${i === 0 ? styles.podiumFirst : ''}`}>
              <div className={styles.medal}>{medals[i + 1]}</div>
              <div className={`${styles.avatar} ${styles[`avatar_${user.avatarColor}`]} ${i === 0 ? styles.avatarLarge : ''}`}>
                {user.initials}
              </div>
              <p className={styles.podiumName}>{user.name}</p>
              <p className={styles.podiumScore}>
                {activeTab === 'Replies' && <>{user.replies} replies</>}
                {activeTab === 'Threads' && <>{user.threads} threads</>}
                {activeTab === 'Accepted' && <>{user.accepted} accepted</>}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs + full list */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
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
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>User</th>
                <th className={styles.th}>Threads</th>
                <th className={styles.th}>Replies</th>
                <th className={styles.th}>Accepted</th>
                <th className={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((user, i) => (
                <tr key={user.id} className={styles.row}>
                  <td className={styles.td}>
                    {medals[i + 1] ? (
                      <span>{medals[i + 1]}</span>
                    ) : (
                      <span className={styles.rank}>{i + 1}</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.userCell}>
                      <div className={`${styles.avatar} ${styles[`avatar_${user.avatarColor}`]}`}>
                        {user.initials}
                      </div>
                      <span className={styles.userName}>{user.name}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={activeTab === 'Threads' ? styles.highlighted : ''}>
                      {user.threads}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={activeTab === 'Replies' ? styles.highlighted : ''}>
                      {user.replies}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={activeTab === 'Accepted' ? styles.highlighted : ''}>
                      {user.accepted}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.joined}>{user.joined}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}