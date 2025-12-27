import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an embedding vector for the given text
 * @param {string} text - The text to convert into an embedding
 * @returns {Promise<number[]>} - Array of 1536 numbers representing the embedding
 */
export async function generateEmbedding(text) {
  try {
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Text must be a non-empty string');
    }

    // Call OpenAI Embeddings API
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',  // Fast, cheap, 1536 dimensions
      input: text,
    });

    // Extract the embedding vector
    const embedding = response.data[0].embedding;

    console.log(`✅ Generated embedding for text: "${text.substring(0, 50)}..."`); 
    console.log(`   Embedding dimensions: ${embedding.length}`);

    return embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    
    // Re-throw with more context
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Check your .env file.');
    } else if (error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Try again later.');
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
