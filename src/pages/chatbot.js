import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Welcome to your AI Health Assistant! Ask me about training, nutrition, or recovery.' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Sorry, something went wrong!' }]);
    }

    setInput('');
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: '40px auto',
        p: 4,
        borderRadius: 4,
        boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        🧠 AI Health & Fitness Coach
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 3, color: '#555' }}>
        Ask anything about workouts, meal planning, supplements, recovery, or goal setting.
      </Typography>

      <Paper
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
        elevation={0}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Avatar sx={{ bgcolor: msg.sender === 'user' ? '#1976d2' : '#4caf50' }}>
                  {msg.sender === 'user' ? <PersonIcon /> : <FitnessCenterIcon />}
                </Avatar>
                <Box>
                  <Typography variant="caption" fontWeight="bold">
                    {msg.sender === 'user' ? 'You' : 'AI Coach'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#e8f5e9',
                      p: 1.5,
                      borderRadius: 2,
                      mt: 0.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your question (e.g. How many grams of protein per day?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
