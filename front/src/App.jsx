import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Tasks from './pages/Tasks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
