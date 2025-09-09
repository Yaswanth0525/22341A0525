import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress
} from '@mui/material';
import { Log } from '../middleware/logger';

const MAX_URLS = 5;

const UrlShortener = ({ auth }) => {
  const [urls, setUrls] = useState(() => {
    const saved = localStorage.getItem('shortened_urls');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    longUrl: '',
    validityPeriod: '30',
    shortcode: ''
  });
  const [progress, setProgress] = useState((urls.length / MAX_URLS) * 100);

  const validateForm = () => {
    try {
      new URL(formData.longUrl);
      const validity = parseInt(formData.validityPeriod);
      if (isNaN(validity) || validity <= 0) {
        throw new Error('Validity period must be a positive number');
      }
      if (formData.shortcode && !/^[a-zA-Z0-9]+$/.test(formData.shortcode)) {
        throw new Error('Shortcode must be alphanumeric');
      }
      if (formData.shortcode && urls.some(url => url.shortcode === formData.shortcode)) {
        throw new Error('Shortcode already exists');
      }
      return true;
    } catch (error) {
      setError(error.message);
      Log('frontend', 'error', 'UrlShortener', `Validation error: ${error.message}`);
      return false;
    }
  };

  const generateShortcode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortcode;
    do {
      shortcode = Array.from({ length: 6 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
    } while (urls.some(url => url.shortcode === shortcode));
    return shortcode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (urls.length >= MAX_URLS) {
      setError('Maximum number of URLs reached (5)');
      Log('frontend', 'error', 'UrlShortener', 'Maximum URL limit reached');
      return;
    }

    if (!validateForm()) return;

    try {
      const shortcode = formData.shortcode || generateShortcode();
      const expiryDate = new Date(Date.now() + parseInt(formData.validityPeriod) * 60000);
      
      const newUrl = {
        originalUrl: formData.longUrl,
        shortcode,
        expiryDate,
        createdAt: new Date(),
        clicks: [],
      };
      const updatedUrls = [...urls, newUrl];
      setUrls(updatedUrls);
      localStorage.setItem('shortened_urls', JSON.stringify(updatedUrls));
      setFormData({ longUrl: '', validityPeriod: '30', shortcode: '' });
      
      Log('frontend', 'info', 'UrlShortener', `URL shortened successfully: ${shortcode}`, auth.token);
    } catch (error) {
      setError('Failed to create short URL');
      Log('frontend', 'error', 'UrlShortener', `Failed to create short URL: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isExpired = (expiryDate) => new Date() > new Date(expiryDate);

  useEffect(() => {
    setProgress((urls.length / MAX_URLS) * 100);
  }, [urls.length]);

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>URL Shortener</Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 2, height: 8, borderRadius: 4 }} 
          />
          <Typography variant="body2" color="text.secondary" align="right" gutterBottom>
            {urls.length} / {MAX_URLS} URLs used
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="longUrl"
                label="Enter your long URL"
                value={formData.longUrl}
                onChange={handleChange}
                fullWidth
                required
                placeholder="https://example.com/very/long/url"
              />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="validityPeriod"
                  label="Valid for (minutes)"
                  type="number"
                  value={formData.validityPeriod}
                  onChange={handleChange}
                  fullWidth
                  placeholder="30"
                />
                <TextField
                  name="shortcode"
                  label="Custom shortcode (optional)"
                  value={formData.shortcode}
                  onChange={handleChange}
                  fullWidth
                  placeholder="mylink123"
                />
              </Stack>

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={urls.length >= MAX_URLS}
              >
                {urls.length >= MAX_URLS ? 'Maximum URLs Reached' : 'Create Short URL'}
              </Button>
            </Stack>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>

      {urls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Your Shortened URLs</Typography>
            <Stack spacing={2}>
              {urls.map((url) => (
                <Card 
                  key={url.shortcode} 
                  variant="outlined"
                  sx={{ 
                    bgcolor: 'background.default',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Short URL
                        </Typography>
                        <Typography 
                          variant="body1" 
                          component="div" 
                          sx={{ 
                            fontFamily: 'monospace',
                            wordBreak: 'break-all'
                          }}
                        >
                          http://localhost:3000/{url.shortcode}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Original URL
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ wordBreak: 'break-all' }}
                        >
                          {url.originalUrl}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={isExpired(url.expiryDate) ? 'Expired' : 'Active'} 
                          color={isExpired(url.expiryDate) ? 'error' : 'success'} 
                          size="small" 
                        />
                        <Typography variant="caption" color="text.secondary">
                          Expires: {new Date(url.expiryDate).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default UrlShortener;
