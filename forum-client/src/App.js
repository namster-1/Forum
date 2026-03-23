
import './App.css';
import Header from './Components/Header/Header'
import HomePage from './Components/Home/HomePage'
import Footer from './Components/Footer/Footer'
import ThreadDetail from './Components/ThreadDetail/ThreadDetail'
import { Routes,Route } from 'react-router-dom'

function ComingSoon({ page }) {
  return (
    <div style={{ maxWidth: '860px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '20px', color: '#111', marginBottom: '8px' }}>{page}</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>This page is coming soon.</p>
    </div>
  );
}


function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/categories" element={<ComingSoon page="Categories" />} />
        <Route path="/tags" element={<ComingSoon page="Tags" />} />
        <Route path="/leaderboard" element={<ComingSoon page="Top Users" />} />
        <Route path="/new-thread" element={<ComingSoon page="New Thread" />} />
        <Route path="*" element={<ComingSoon page="Page not found" />} />
      </Routes>
      <Footer />
    </div>
    
  );
}

export default App;
