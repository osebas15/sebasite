import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Me from './app';

// Message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const me = new Me();

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await me.chat(input, history);
      setMessages((msgs) => [...msgs, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error: Unable to get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '40px auto', p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Chat with Sebastian Aguirre
      </Typography>
      <Paper sx={{ minHeight: 400, maxHeight: 500, overflowY: 'auto', p: 2, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <Typography
              variant="body1"
              sx={{
                display: 'inline-block',
                bgcolor: msg.role === 'user' ? '#1976d2' : '#e0e0e0',
                color: msg.role === 'user' ? 'white' : 'black',
                borderRadius: 2,
                px: 2,
                py: 1,
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
        {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        <div ref={chatEndRef} />
      </Paper>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatApp;
