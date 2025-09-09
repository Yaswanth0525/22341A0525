import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress } from '@mui/material';
import { Log } from '../middleware/logger';

const UrlRedirect = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  useEffect(() => {
    const redirect = async () => {
      try {
        const urls = JSON.parse(localStorage.getItem('shortened_urls') || '[]');
        const url = urls.find(u => u.shortcode === shortcode);
        
        if (!url) {
          throw new Error('URL not found');
        }

        if (new Date() > new Date(url.expiryDate)) {
          throw new Error('URL has expired');
        }
        const clickData = {
          timestamp: new Date(),
          source: document.referrer || 'Direct',
          location: 'Local'
        };

        url.clicks.push(clickData);
        localStorage.setItem('shortened_urls', JSON.stringify(urls));

        Log('frontend', 'info', 'UrlRedirect', `Redirecting to: ${url.originalUrl}`);
        window.location.href = url.originalUrl;
      } catch (error) {
        Log('frontend', 'error', 'UrlRedirect', `Redirect failed: ${error.message}`);
        setError(error.message);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    redirect();
  }, [shortcode, navigate]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">
          {error}. Redirecting to home...
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );
};

export default UrlRedirect;
