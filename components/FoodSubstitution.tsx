import React, { useState, useEffect } from 'react';
import { Food, LoggedFood } from '../types';
import { foodDatabase } from '../data/foods';
import { findSimilarFoods } from '../utils/calculations';

interface FoodSubstitutionProps {
  food: LoggedFood;
  onClose: () => void;
  onReplace: (newFood: Food) => void;
}

const FoodSubstitution: React.FC<FoodSubstitutionProps> = ({ food, onClose, onReplace }) => {
  const [similarFoods, setSimilarFoods] = useState<Food[]>([]);

  useEffect(() => {
    // Extrai o ID numérico original do ID do LoggedFood (ex: "3-167...")
    const originalFoodId = parseInt(food.id.split('-')[0], 10);
    const originalFood = foodDatabase.find(f => f.id === originalFoodId);
    
    if (originalFood) {
      const suggestions = findSimilarFoods(originalFood, foodDatabase);
      setSimilarFoods(suggestions);
    }
  }, [food.id]);

  const originalFoodDetails = foodDatabase.find(f => f.id === parseInt(food.id.split('-')[0], 10));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Substituir Alimento</h2>
        
        {originalFoodDetails && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl">
                <p className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">{originalFoodDetails.name}</p>
                <div className="flex justify-around text-xs mt-2 text-gray-600 dark:text-gray-300">
                    <span>{originalFoodDetails.calories} kcal</span>
                    <span>P: {originalFoodDetails.protein}g</span>
                    <span>C: {originalFoodDetails.carbs}g</span>
                    <span>G: {originalFoodDetails.fat}g</span>
                </div>
            </div>
        )}

        <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Sugestões (para 100g):</h3>
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {similarFoods.length > 0 ? similarFoods.map(suggestion => (
                <div key={suggestion.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/80 rounded-xl">
                    <div>
                        <p className="font-semibold">{suggestion.name}</p>
                        <div className="flex gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>{suggestion.calories} kcal</span>
                            <span>P: {suggestion.protein}g</span>
                            <span>C: {suggestion.carbs}g</span>
                            <span>G: {suggestion.fat}g</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => onReplace(suggestion)}
                        className="bg-emerald-500 text-white font-bold text-sm px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Substituir
                    </button>
                </div>
            )) : <p className="text-center text-gray-500">Nenhuma sugestão encontrada.</p>}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default FoodSubstitution;
