import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Items } from './pages/Items';
import { Record } from './pages/Record';
import { Plan } from './pages/Plan';

type Page = 'home' | 'items' | 'record' | 'plan' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'settings':
        return <Settings />;
      case 'items':
        return <Items />;
      case 'record':
        return <Record onNavigateHome={() => setCurrentPage('home')} />;
      case 'plan':
        return <Plan />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
