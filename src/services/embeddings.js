// Using Ollama for local, free embeddings (no payment required!)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';

/**
 * Generate an embedding vector for the given text using Ollama
 * @param {string} text - The text to convert into an embedding
 * @returns {Promise<number[]>} - Array of numbers representing the embedding
 */
export async function generateEmbedding(text) {
  try {
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Text must be a non-empty string');
    }

    // Call Ollama Embeddings API
    const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const embedding = data.embedding;

    console.log(`✅ Generated embedding for text: "${text.substring(0, 50)}..."`); 
    console.log(`   Embedding dimensions: ${embedding.length}`);
    console.log(`   Model: ${EMBEDDING_MODEL}`);

    return embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running (try "ollama serve")');
    } else {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * @param {string[]} texts - Array of texts to convert
 * @returns {Promise<number[][]>} - Array of embeddings
 */
export async function generateEmbeddings(texts) {
  try {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Texts must be a non-empty array');
    }

    // Generate embeddings in parallel
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    );

    console.log(`✅ Generated ${embeddings.length} embeddings`);
    return embeddings;
  } catch (error) {
    console.error('❌ Error generating batch embeddings:', error.message);
    throw error;
  }
}
