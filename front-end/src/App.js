import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import ProvincesList from './pages/ProvinceList';
import TextArea from './pages/TextArea';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/provinces" element={<ProvincesList />} />
      <Route path="/text" element={<TextArea/>}/>
    </Routes>
  );
}

export default App;
