/**
 * Generates a short, encouraging message for a child based on their math game performance.
 */
export const getTeacherFeedback = async (
  correct: number,
  total: number,
  accuracy: number
): Promise<string | null> => {
  // Get API key from window object
  const apiKey = (window as any).GEMINI_API_KEY;
  
  // If no API key is present, we simply return null and the UI will show a default message.
  if (!apiKey) {
    console.warn("Gemini API Key missing. Skipping AI feedback.");
    return null;
  }

  try {
    const prompt = `
      You are a kind and wise Wizarding School Professor (like Dumbledore or McGonagall).
      A young student wizard just finished a 30-second speed Arithmancy (multiplication) duel.
      Stats:
      - Spells cast correctly: ${correct}
      - Total attempts: ${total}
      - Accuracy: ${accuracy}%
      
      Write a VERY SHORT (max 15 words) magical, encouraging feedback message. 
      Use wizarding terms (spells, charms, magic) and emojis 🧙‍♂️✨🦉.
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("Error fetching Gemini feedback:", error);
    return null;
  }
};
