import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import './App.css';
import AuthBackground from './components/AuthBackground';

const AppInner = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {isAuthRoute && <AuthBackground />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppInner />
    </Router>
  );
};

export default App;
