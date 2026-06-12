"use server";

import OpenAI from 'openai';

// On utilise le SDK OpenAI mais configuré pour pointer vers l'API gratuite de Groq
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function generateMessageAction(clientType: string, service: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("La clé d'API GROQ_API_KEY n'est pas configurée dans le fichier .env.local.");
  }

  try {
    const prompt = `
Tu es un expert en prospection B2B et en copywriting. 
Ton objectif est de rédiger un court message d'approche (cold outreach) très efficace, amical, professionnel et convaincant.

Informations sur la cible :
- Type de client : ${clientType}
- Service que je propose : ${service}

Consignes strictes :
- Le message doit être court (max 100 mots).
- Ton : professionnel mais chaleureux (vouvoiement par défaut).
- Structure : Une accroche personnalisée, la valeur apportée (le service), et un appel à l'action (Call to Action) clair et doux à la fin (ex: un court appel).
- Ne mets PAS d'objets d'email, donne juste le corps du message directement.
- Utilise des sauts de ligne pour rendre le texte aéré.
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Modèle très rapide et gratuit sur Groq
      temperature: 0.7,
    });

    return completion.choices[0].message.content?.trim() || "Erreur de génération.";
  } catch (error) {
    console.error("Erreur lors de la génération du message :", error);
    throw new Error("Impossible de générer le message pour le moment.");
  }
}
