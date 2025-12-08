const express = require('express');
const router = express.Router();

// Mock AI Chat Endpoint
router.post('/', async (req, res) => {
  try {
    const { message, videoUrl } = req.body;
    
    // Simulate AI processing delay
    setTimeout(() => {
        let aiResponse = "I analyzed your input. ";
        
        if (videoUrl) {
            aiResponse += "That serve technique looks fluid, but try to extend your arm more at the contact point. Your follow-through is good. ";
        }
        
        if (message) {
             aiResponse += `Regarding "${message}", focus on consistent practice and footwork.`;
        }

        res.json({ response: aiResponse });
    }, 1500);

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
