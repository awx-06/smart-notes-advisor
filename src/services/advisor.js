import fetch from 'node-fetch';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

/**
 * Generate AI-powered insights from search results
 */
export async function generateInsights(query, notes) {
    try {
        // Build context from notes
        const notesContext = notes
            .map((note, index) => {
                return `Note ${index + 1} (Similarity: ${note.similarity}):\n${note.content}`;
            })
            .join('\n\n');
        
        // Create prompt for the LLM
        const prompt = `You are a smart notes advisor.  A user has searched for: "${query}"

Here are the most relevant notes from their knowledge base:

${notesContext}

Based on these notes, provide:
1. 📚 A brief summary of what the user knows about this topic
2. 💡 Key insights and connections between the notes
3. 🎯 Actionable recommendations or next steps
4. 📝 Mention which notes are most relevant

Keep your response concise, helpful, and well-structured.`;
        console.log('🤖 Generating AI insights...');

        // Call Ollama API
        const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: prompt,
                stream: false,
            }),
        });

        if(!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('✅ AI insights generated');

        return data.response;
    } catch (error) {
        console.error('❌ Error generating insights:', error);
        throw new Error(`Failed to generate insights: ${error.message}`);
    } 
}