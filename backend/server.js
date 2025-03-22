const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
require('dotenv').config();

// Initialize aiTools with default empty array if data.json fails to load
let aiTools = [];
try {
    const data = require('./data.json');
    aiTools = data.aiTools || [];
} catch (error) {
    console.error('Error loading data.json:', error);
}

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

const correctUrls = {
    'bolt.dev': 'https://bolt.new',
    'bolt.ai': 'https://bolt.new',
    'bolt.com': 'https://bolt.new',
    'bolt.io': 'https://bolt.new',
    'bolt.app': 'https://bolt.new',
    'boltai.com': 'https://bolt.new',
    'napkinai.com': 'https://napkin.ai',
    'napkin.io': 'https://napkin.ai',
    'claude.com': 'https://claude.ai',
    'anthropic.ai': 'https://anthropic.com'
};

function getCorrectUrl(url) {
    try {
        // Extract domain from URL
        let domain = url.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
        
        // Handle www. prefixes
        domain = domain.replace(/^www\./, '');
        
        return correctUrls[domain] || url;
    } catch (error) {
        console.error('Error processing URL:', error);
        return url;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Search and filter endpoint
app.get('/api/tools', (req, res) => {
    const { search, category } = req.query;
    let filteredTools = aiTools;

    if (search) {
        const searchTerms = search.toLowerCase().split(' ');
        filteredTools = filteredTools.filter(tool =>
            searchTerms.some(term => 
                tool.name.toLowerCase().includes(term) ||
                tool.description.toLowerCase().includes(term) ||
                tool.category.toLowerCase().includes(term)
            )
        );
    }

    if (category) {
        filteredTools = filteredTools.filter(tool => 
            tool.category.toLowerCase() === category.toLowerCase()
        );
    }

    res.json(filteredTools);
});

// Updated suggestions endpoint with fallback to Grok API
app.get('/api/suggestions', async (req, res) => {
    const GROK_API_KEY = process.env.GROK_API_KEY;
    const { query } = req.query;

    try {
        if (!query || query.length < 2) {
            return res.json([]);
        }

        if (!Array.isArray(aiTools)) {
            console.error('aiTools is not an array');
            return res.status(500).json({ error: 'Data configuration error' });
        }

        const searchTerm = query.toLowerCase();
        let suggestions = aiTools
            .filter(tool =>
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.category.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm)
            )
            .map(tool => ({
                name: tool.name,
                category: tool.category,
                description: tool.description.substring(0, 100),
                link: tool.link || '' // Include link if present in local data, empty string if not
            ,}))
            .slice(0, 5);

        if (suggestions.length < 3 && GROK_API_KEY) {
            try {
                const grokResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                    model: "llama3-70b-8192",  // <-- Updated model
                    messages: [
                        {
                            role: "system",
                            content: `You are a JSON response generator. Follow these URL rules strictly:
                            Common tool URLs:
                            - Napkin AI: "https://napkin.ai"
                            - Bolt: "https://bolt.new"
                            - Phind: "https://phind.com"
                            - Claude AI: "https://claude.ai"
                            - Midjourney: "https://midjourney.com"
                            - Anthropic: "https://anthropic.com"
                            - Perplexity AI: "https://perplexity.ai"
                            For all other tools:
                            - Always use https://
                            - Verify the domain is correct
                            - Use the main website domain, not subdomains
                            Respond with a valid JSON object containing a key 'tools' with an array of exactly 3 tool objects.
                            Each tool object must have 'name', 'description', 'category', and 'link' fields.`
                        },
                        {
                            role: "user",
                            content: `Generate a JSON object for AI tools related to "${query}". The object should have a single key "tools" containing an array of 3 tools, each with "name", "description", "category", and "link". Use the exact URLs from the rules when suggesting known tools.`
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 800,
                    response_format: { type: "json_object" }
                }, {
                    headers: {
                        'Authorization': `Bearer ${GROK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                

                const content = grokResponse.data.choices[0].message.content.trim();
                const jsonData = JSON.parse(content);
                const grokSuggestions = Array.isArray(jsonData.tools)
                    ? jsonData.tools.filter(s => s && s.name && s.description && s.link) // Ensure link is present
                    : [];
                const additionalSuggestions = grokSuggestions.slice(0, 3 - suggestions.length).map(s => ({
                    name: s.name,
                    description: s.description,
                    category: s.category || 'AI Tool',
                    link: s.link
                }));
                suggestions = [...suggestions, ...additionalSuggestions];
            } catch (grokError) {
                console.error('Grok API error in suggestions:', grokError.response?.data || grokError.message);
            }
        }

        res.json(suggestions);
    } catch (error) {
        console.error('Suggestion error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Updated Grok suggestions endpoint with corrected URL
app.get('/api/grok-suggestions', async (req, res) => {
    const { query, page = 1 } = req.query;
    const limit = 3; // Number of suggestions per page
    
    try {
        const GROK_API_KEY = process.env.GROK_API_KEY?.trim();
        
        if (!GROK_API_KEY) {
            return res.json([]);
        }

        if (!query) {
            return res.json([]);
        }

        const grokResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama3-70b-8192",
            messages: [
                {
                    role: "system",
                    content: `You are a JSON response generator. Follow these URL rules strictly:
                    Common tool URLs:
                    - Napkin AI: "https://napkin.ai"
                    - Bolt: "https://bolt.new"
                    - Phind: "https://phind.com"
                    - Claude AI: "https://claude.ai"
                    - Midjourney: "https://midjourney.com"
                    - Anthropic: "https://anthropic.com"
                    - Perplexity AI: "https://perplexity.ai"
                    
                    For all other tools:
                    - Always use https://
                    - Verify the domain is correct
                    - Use the main website domain, not subdomains
                    
                    Respond with a valid JSON object containing a key 'tools' with an array of exactly 3 DIFFERENT tool objects.
                    Each tool object must have 'name', 'description', 'category', and 'link' fields.
                    For page > 1, provide completely different suggestions than previous pages.`
                },
                {
                    role: "user",
                    content: `Generate page ${page} of JSON results for AI tools related to "${query}". Generate 3 DIFFERENT tools than previous pages. The object should have a single key "tools" containing an array of 3 unique tools, each with "name", "description", "category", and "link". Use the exact URLs from the rules when suggesting known tools.`
                }
            ],
            temperature: 0.7, // Increased temperature for more variety
            max_tokens: 800,
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Authorization': `Bearer ${GROK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let suggestions = [];
        const content = grokResponse.data.choices[0].message.content.trim();
        const jsonData = JSON.parse(content);
        if (jsonData && Array.isArray(jsonData.tools)) {
            suggestions = jsonData.tools
                .filter(s => s && s.name && s.description && s.link) // Ensure link is present
                .slice(0, 3)
                .map(s => ({
                    name: s.name,
                    description: s.description,
                    category: s.category || 'AI Tool',
                    link: getCorrectUrl(s.link)
                }));
        } else {
            console.error('Invalid response format from Groq API:', content);
        }

        const startIndex = (page - 1) * limit;
        const paginatedSuggestions = suggestions.slice(startIndex, startIndex + limit);
        
        res.json(paginatedSuggestions);
    } catch (error) {
        console.error('Groq API error:', error.response?.data || error.message);
        res.json([]);
    }
});
// Endpoint to add a new tool
app.post('/api/tools', (req, res) => {
    const { name, category, description } = req.body;

    if (!name || !category || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newTool = {
        id: aiTools.length + 1,
        name,
        category,
        description,
    };

    aiTools.push(newTool);
    res.status(201).json(newTool);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
