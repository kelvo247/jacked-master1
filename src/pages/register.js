import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box
} from '@mui/material';

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    sex: 'Male'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ Registration successful! Please log in.`);
      router.push('/login'); // ✅ Redirect to login page
    } else {
      alert('❌ ' + data.error);
    }
  };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 400,
                margin: 'auto',
                mt: 4,
                padding: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                Register12
            </Typography>
            <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                select
                label="Sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
            >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
            </TextField>
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Register
            </Button>
        </Box>
    );
};

export default Register;
