
import OpenAI from 'openai';
import fs from 'fs';

const envLocal = fs.readFileSync('.env.local', 'utf-8');
const match = envLocal.match(/GROQ_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : process.env.GROQ_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function testGroq() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Test" }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
    console.log("Success:", completion.choices[0].message.content);
  } catch (err) {
    console.error("Groq Error:", err.message);
  }
}

testGroq();
