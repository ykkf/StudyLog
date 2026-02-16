import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Items } from './pages/Items';
import { Record } from './pages/Record';
import { Plan } from './pages/Plan';

import { History } from './pages/History';
import type { StudyRecord, Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [editingRecord, setEditingRecord] = useState<StudyRecord | null>(null);

  const handleEditRecord = (record: StudyRecord) => {
    setEditingRecord(record);
    setCurrentPage('record');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigateHistory={() => setCurrentPage('history')} />;
      case 'settings':
        return <Settings />;
      case 'items':
        return <Items />;
      case 'record':
        return <Record
          onNavigateHome={() => {
            setCurrentPage('home');
            setEditingRecord(null);
          }}
          initialData={editingRecord}
        />;
      case 'plan':
        return <Plan />;
      case 'history':
        return <History onEdit={handleEditRecord} />;
      default:
        return <Home onNavigateHistory={() => setCurrentPage('history')} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
