import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper, Link } from '@mui/material';
import log from '../utils/logger';

const Shortener = () => {
  const [urls, setUrls] = useState(['', '', '', '', '']);
  const [results, setResults] = useState([]);

  const handleUrlInput = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const processSubmission = (event) => {
    event.preventDefault();
    const activeUrls = urls.filter(url => url.trim() !== '');

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    for (const url of activeUrls) {
      if (!urlPattern.test(url)) {
        log.error('URLForm', `Invalid URL: ${url}`);
        alert(`Invalid URL: ${url}`);
        return;
      }
    }

    const shortUrls = activeUrls.map(url => {
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const shortened = `http://short.ly/${uniqueId}`;
      log.info('URLForm', `Generated link: ${url} -> ${shortened}`);
      return {
        original: url,
        shortened,
        expires: new Date(Date.now() + 3600000).toLocaleString(),
      };
    });
    setResults(shortUrls);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Link Reducer
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box component="form" onSubmit={processSubmission} noValidate>
            <Grid container spacing={2}>
              {urls.map((url, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    fullWidth
                    label={`Original Link ${index + 1}`}
                    variant="outlined"
                    value={url}
                    onChange={(e) => handleUrlInput(index, e.target.value)}
                  />
                </Grid>
              ))}
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Generate Links
            </Button>
          </Box>
        </Paper>

        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Reduced Links
            </Typography>
            <Grid container spacing={2}>
              {results.map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      **Original:** {result.original}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ wordBreak: 'break-all' }}>
                      **Reduced:** <Link href={result.shortened} target="_blank" rel="noopener noreferrer">{result.shortened}</Link>
                    </Typography>
                    <Typography variant="caption" display="block">
                      **Expires:** {result.expires}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Shortener;