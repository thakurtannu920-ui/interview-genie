const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req,res)=>{
  res.send("Server Running ✅");
});

app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, answer } = req.body;

    const prompt = `Question: ${question}\nAnswer: ${answer}\nGive JSON {score:0-5, feedback:"text"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json(JSON.parse(response.text().replace(/```json|```/g, "")));
  } catch {
    res.json({ score: 3, feedback: "Keep practicing!" });
  }
});

app.listen(3000, () => console.log("Server started"));
