
// pages/api/chatbot.js (for example)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // ✅ Using Groq key from environment variables
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // ✅ Llama 3 70B model
        messages: [
          { role: "system", content: "You are a helpful fitness and nutrition coach. Give friendly, clear, and motivational advice." },
          { role: "user", content: message },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error details:', errorData);
      return res.status(response.status).json({ message: 'Error from Groq API' });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Groq API connection error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
