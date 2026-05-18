require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
.then(res => res.json())
.then(data => console.log(data.models.map(m => m.name).join(', ')))
.catch(console.error);
