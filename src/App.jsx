import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import AuthPage from './components/AuthPage';
import UrlRedirect from './components/UrlRedirect';
import { useState } from 'react';
import { Log } from './middleware/logger';

function App() {
  const [auth, setAuth] = useState(null);

  const handleAuthSuccess = (tokenData) => {
    setAuth(tokenData);
    Log('frontend', 'info', 'AuthPage', 'User authenticated successfully');
  };

  if (!auth) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shorten URL</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlShortener auth={auth} />} />
          <Route path="/stats" element={<Statistics auth={auth} />} />
          <Route path="/:shortcode" element={<UrlRedirect />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
