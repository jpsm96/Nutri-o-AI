
import { GoogleGenAI, Type } from '@google/genai';
import { IdentifiedFood } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found in environment variables. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeImageWithGemini = async (base64Image: string, mimeType: string): Promise<IdentifiedFood[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Você é um especialista em análise nutricional de pratos brasileiros. Sua tarefa é identificar todos os itens alimentares e estimar suas quantidades em gramas a partir da imagem fornecida. Retorne um array JSON de objetos. Cada objeto deve representar um item alimentar distinto e ter duas chaves: "foodName" (o nome do alimento em português do Brasil, sendo o mais específico possível, ex: "Arroz branco, cozido") e "quantityGrams" (um número inteiro estimado do peso em gramas). Retorne apenas o array JSON, sem formatação markdown ou texto introdutório.`,
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              foodName: {
                type: Type.STRING,
                description: "O nome específico do alimento em português do Brasil.",
              },
              quantityGrams: {
                type: Type.NUMBER,
                description: "A quantidade estimada do alimento em gramas.",
              },
            },
            required: ["foodName", "quantityGrams"],
          },
        },
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as IdentifiedFood[];

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Não foi possível analisar a imagem. Tente novamente.");
  }
};
