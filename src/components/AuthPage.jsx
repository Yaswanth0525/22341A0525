import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';

const initialState = {
  email: '',
  name: '',
  mobileNo: '',
  githubUsername: '',
  rollNo: '',
  accessCode: '',
};

const AuthPage = ({ onAuthSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://20.244.56.144/evaluation-service/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to get client credentials');
      const tokenRes = await fetch('http://20.244.56.144/evaluation-service/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientID: data.clientID,
          clientSecret: data.clientSecret,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.message || 'Failed to get token');
      onAuthSuccess(tokenData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Authenticate</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {Object.keys(initialState).map((key) => (
          <TextField
            key={key}
            name={key}
            label={key}
            value={form[key]}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Authenticating...' : 'Authenticate'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default AuthPage;
