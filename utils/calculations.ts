import { UserProfile, Food } from '../types';

// Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// GET (Gasto Energético Total) or TDEE (Total Daily Energy Expenditure)
export const calculateGET = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  return Math.round(bmr * profile.activityLevel);
};

// BMI (Body Mass Index)
export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0) return 0;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

/**
 * Encontra alimentos com perfis nutricionais semelhantes a um alimento base.
 * @param baseFood O alimento para o qual encontrar substitutos.
 * @param allFoods A lista de todos os alimentos disponíveis para comparação.
 * @param count O número de sugestões a serem retornadas.
 * @returns Uma lista de alimentos semelhantes.
 */
export const findSimilarFoods = (baseFood: Food, allFoods: Food[], count: number = 5): Food[] => {
  const calculateScore = (foodToCompare: Food): number => {
    // Evita divisão por zero para alimentos com macros zerados (ex: azeite), retornando uma pontuação alta.
    const safeBaseProtein = baseFood.protein === 0 ? 0.1 : baseFood.protein;
    const safeBaseCarbs = baseFood.carbs === 0 ? 0.1 : baseFood.carbs;
    const safeBaseFat = baseFood.fat === 0 ? 0.1 : baseFood.fat;
    
    const calDiff = Math.abs(baseFood.calories - foodToCompare.calories) / baseFood.calories;
    const protDiff = Math.abs(baseFood.protein - foodToCompare.protein) / safeBaseProtein;
    const carbDiff = Math.abs(baseFood.carbs - foodToCompare.carbs) / safeBaseCarbs;
    const fatDiff = Math.abs(baseFood.fat - foodToCompare.fat) / safeBaseFat;
    
    // Pontuação ponderada. Calorias são mais importantes, seguidas por proteínas.
    return (calDiff * 0.5) + (protDiff * 0.25) + (carbDiff * 0.15) + (fatDiff * 0.1);
  };
  
  return allFoods
    .filter(food => food.id !== baseFood.id) // Exclui o próprio alimento
    .map(food => ({ food, score: calculateScore(food) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(item => item.food);
};
