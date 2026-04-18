export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
 
  const { category } = req.body || {};
 
  const prompts = {
    harmlos: `Generiere eine einzige kurze Ja/Nein-Frage für ein harmloses Partytrinkspiel für Erwachsene.
Die Frage soll leicht persönlich aber nicht intim sein. Kurz und direkt.
Beispiele: "Hast du heute schon gelogen?", "Schläfst du manchmal mit Socken?"
Antworte NUR mit der Frage. Kein Anführungszeichen, kein Punkt am Ende, nichts weiter.`,
 
    cringe: `Generiere eine einzige kurze Ja/Nein-Frage für ein Partytrinkspiel.
Die Frage soll etwas peinlich oder cringe sein – über Social Media Stalking, peinliche Momente, heimliche Gedanken.
Beispiel: "Hast du schonmal jemanden gegoogelt den du attraktiv findest?"
Antworte NUR mit der Frage. Kein Anführungszeichen, nichts weiter.`,
 
    '18+': `Generiere eine einzige kurze Ja/Nein-Frage für ein Partytrinkspiel für Erwachsene (18+).
Die Frage soll direkt und spicy sein, über Beziehungen, Flirten, Geheimnisse.
Beispiel: "Hast du schonmal jemanden geküsst den du nicht mochtest?"
Antworte NUR mit der Frage. Kein Anführungszeichen, nichts weiter.`
  };
 
  const prompt = prompts[category] || prompts['harmlos'];
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 80,
        messages: [{ role: 'user', content: prompt }]
      })
    });
 
    const data = await response.json();
    const question = data.content?.[0]?.text?.trim() || '';
    return res.status(200).json({ question });
 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fehler beim Generieren' });
  }
}
