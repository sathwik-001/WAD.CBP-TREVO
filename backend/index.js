const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage, HumanMessage, ToolMessage } = require("@langchain/core/messages");

const app = express();
app.use(cors()); 
app.use(express.json());
const { runPipeline } = require('./itineraryPipeline');

// Maintain N8N Webhook Endpoint Compatibility
app.post('/react-input-data', async (req, res) => {
    try {
        const userMessage = req.body.message || "I am in Hyderabad. I wanna go to red fort, india gate and taj mahal. I m total 4 people and my max budget is 50k.";
        console.log("-> Starting Full Automated Itinerary Pipeline for:", userMessage);
        
        // Execute the entire backend replacement pipeline
        const finalResults = await runPipeline(userMessage);

        res.json(finalResults);
    } catch (e) {
        console.error("Workflow execution failed:", e);
        res.status(500).json({ status: "Error", errorMessage: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Keep event loop alive
setInterval(() => {}, 100000);
