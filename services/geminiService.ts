
import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askAssistant(question: string, appData: AppState) {
  try {
    const context = `
      Você é o assistente inteligente da H Água, uma revenda de água e gás.
      Dados Atuais:
      - Clientes: ${appData.clients.length}
      - Produtos em estoque: ${appData.products.map(p => `${p.name}: ${p.stock}`).join(', ')}
      - Vendas totais: ${appData.sales.length}
      - Entregas hoje: ${appData.deliveries.length}
      
      Responda de forma curta, prestativa e profissional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: context,
      },
    });

    return response.text || "Desculpe, não consegui processar sua pergunta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a inteligência artificial.";
  }
}

export async function getDemandPrediction(appData: AppState) {
  try {
    const salesContext = appData.sales.map(s => ({
      date: s.date,
      total: s.total,
      items: s.items.map(i => `${i.name} x${i.quantity}`)
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise este histórico de vendas e preveja a demanda para os próximos 7 dias. Retorne sugestões de estoque.`,
      config: {
        systemInstruction: `Histórico: ${JSON.stringify(salesContext)}. Gere um resumo em JSON com campos: predictionSummary (string), stockSuggestions (array de strings).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictionSummary: { type: Type.STRING },
            stockSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["predictionSummary", "stockSuggestions"]
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    return {
      predictionSummary: "Não foi possível gerar a previsão no momento.",
      stockSuggestions: ["Mantenha o estoque conforme a média histórica."]
    };
  }
}

export async function suggestPromotions(appData: AppState) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Sugira 3 promoções baseadas nos dados de estoque: ${JSON.stringify(appData.products)}`,
            config: {
                systemInstruction: "Crie promoções criativas para aumentar vendas de produtos parados ou combos.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["title", "description"]
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        return [];
    }
}
