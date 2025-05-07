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
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h4" mb={2}>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth name="name" label="Name" margin="normal"
          value={formData.name} onChange={handleChange}
        />
        <TextField
          fullWidth name="email" label="Email" type="email" margin="normal"
          value={formData.email} onChange={handleChange}
        />
        <TextField
          fullWidth name="password" label="Password" type="password" margin="normal"
          value={formData.password} onChange={handleChange}
        />
        <TextField
          fullWidth name="age" label="Age" type="number" margin="normal"
          value={formData.age} onChange={handleChange}
        />
        <Typography mt={2}>Sex:</Typography>
        <RadioGroup row name="sex" value={formData.sex} onChange={handleChange}>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>

        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
