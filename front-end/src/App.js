import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import ProvincesList from './pages/ProvinceList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/provinces" element={<ProvincesList />} />
    </Routes>
  );
}

export default App;
