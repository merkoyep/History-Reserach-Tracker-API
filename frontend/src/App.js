import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Home from './views/Home.jsx';
import Dashboard from './views/Dashboard.jsx';
import Sources from './views/Sources.jsx';
import SourceDetail from './views/SourceDetail.jsx';
import Citations from './views/Citations.jsx';
import { AuthProvider } from './contexts/AuthContext';
import CitationDetail from './views/CitationDetail.jsx';

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/sources' element={<Sources />} />
            <Route path='/citations' element={<Citations />} />
            <Route path='/source/:id' element={<SourceDetail />} />
            <Route path='/citation/:id' element={<CitationDetail />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
