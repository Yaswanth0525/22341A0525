import React from 'react';
import { 
  Paper, 
  Typography, 
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Stack,
  Box
} from '@mui/material';
import { Log } from '../middleware/logger';

const UrlCard = ({ url }) => {
  const isExpired = new Date() > new Date(url.expiryDate);
  const timeLeft = isExpired ? 'Expired' : getTimeLeft(url.expiryDate);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Short URL</Typography>
            <Typography variant="body1" component="div" sx={{ wordBreak: 'break-all' }}>
              http://localhost:3000/{url.shortcode}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Original URL</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {url.originalUrl}
            </Typography>
          </Box>

          <Divider />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">Created</Typography>
              <Typography variant="body2">
                {formatDate(url.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Chip 
                label={timeLeft}
                color={isExpired ? 'error' : 'success'}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary">Total Clicks</Typography>
              <Typography variant="h6" color="primary">
                {url.clicks.length}
              </Typography>
            </Grid>
          </Grid>

          {url.clicks.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle1">Click History</Typography>
              <Stack spacing={1}>
                {url.clicks.map((click, index) => (
                  <Box key={index} sx={{ bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">When</Typography>
                        <Typography variant="body2">{formatDate(click.timestamp)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">Source</Typography>
                        <Typography variant="body2">{click.source || 'Direct'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">Location</Typography>
                        <Typography variant="body2">{click.location || 'Unknown'}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimeLeft = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m left`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m left`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h left`;
};

const Statistics = ({ urls = [] }) => {
  React.useEffect(() => {
    Log('frontend', 'info', 'Statistics', 'Statistics page viewed');
  }, []);

  if (urls.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>URL Statistics</Typography>
        <Typography color="text.secondary">No URLs have been shortened yet</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>URL Statistics</Typography>
      <Box sx={{ mt: 3 }}>
        {urls.map((url) => (
          <UrlCard key={url.shortcode} url={url} />
        ))}
      </Box>
    </Paper>
  );
};

export default Statistics;
