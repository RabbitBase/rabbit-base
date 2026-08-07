/**
 * Utility to generate a 3-step RPG roadmap using the free Gemini API.
 * 
 * @param {string} repoName - The name of the target repository (e.g., "facebook/react")
 * @param {string} repoUrl - The URL of the target repository
 * @param {string} goal - The selected contribution goal
 * @returns {Promise<string>} The AI-generated roadmap text
 */
export async function generateRoadmap(repoName, repoUrl, goal) {
  // We pull the API key securely from our Vite environment variables (.env.local)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error("Missing or invalid VITE_GEMINI_API_KEY in .env.local file.");
  }

  // The specific Gemini endpoint for generating text using the flash model
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // This is the prompt that gives the AI its "RPG Quest-Giver" persona
  const systemPrompt = `
    You are a tactical RPG quest-giver for open-source developers. 
    The user wants to contribute to a repository named ${repoName} (${repoUrl}).
    Their specific mission objective is: "${goal}".
    Provide a fast, punchy 3-step technical roadmap for contributing to this specific repository based on their objective.
    Keep it beginner-friendly, exciting, and format it using markdown. 
    Do NOT write a massive essay. Keep it concise.
  `;

  // We use standard fetch() to make the API call to avoid complex wrapper libraries
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // The body must match exactly what the Gemini API expects
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text from the Gemini response structure
    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error("Failed to generate AI roadmap:", error);
    throw error;
  }
}
