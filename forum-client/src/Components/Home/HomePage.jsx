import CategoryGrid from './CategoryGrid';
import ThreadList from './ThreadList';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      <CategoryGrid />
      <ThreadList />
    </main>
  );
}