import React, { useState } from 'react';
import { DailyLog, LoggedFood, MealType, Food } from '../types';
import { TrashIcon, RefreshIcon } from './Icons';
import FoodSubstitution from './FoodSubstitution';

interface DiaryProps {
  dailyLog: DailyLog;
  removeFoodFromLog: (loggedFoodId: string) => void;
  replaceFoodInLog: (loggedFoodId: string, newFood: Food) => void;
}

const mealsOrder: MealType[] = ['Café da Manhã', 'Almoço', 'Jantar', 'Lanches'];

const Diary: React.FC<DiaryProps> = ({ dailyLog, removeFoodFromLog, replaceFoodInLog }) => {
  const sortedDates = Object.keys(dailyLog).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const [substitutingFood, setSubstitutingFood] = useState<LoggedFood | null>(null);

  const handleReplace = (newFood: Food) => {
    if (substitutingFood) {
      replaceFoodInLog(substitutingFood.id, newFood);
      setSubstitutingFood(null);
    }
  };

  return (
    <>
      <div className="py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Seu Diário Alimentar</h1>
        
        {sortedDates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Seu diário está vazio.</p>
            <p className="text-sm text-gray-400">Adicione uma refeição para começar a acompanhar!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => {
              const dayLog = dailyLog[date];
              const groupedByMeal = dayLog.reduce((acc, item) => {
                (acc[item.meal] = acc[item.meal] || []).push(item);
                return acc;
              }, {} as Record<MealType, LoggedFood[]>);

              const totalCaloriesForDay = dayLog.reduce((sum, item) => sum + (item.calories * item.quantity / 100), 0);

              return (
                <div key={date} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-bold">
                      {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                    </h2>
                    <span className="font-semibold text-emerald-500">{Math.round(totalCaloriesForDay)} kcal</span>
                  </div>
                  <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  <div className="space-y-4">
                    {mealsOrder.map(meal => {
                      if (groupedByMeal[meal]) {
                        const totalMealCalories = groupedByMeal[meal].reduce((sum, item) => sum + (item.calories * item.quantity / 100), 0);
                        return (
                          <div key={meal}>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-semibold">{meal}</h3>
                              <span className="text-sm font-medium text-gray-500">{Math.round(totalMealCalories)} kcal</span>
                            </div>
                            <ul className="space-y-2">
                              {groupedByMeal[meal].map(item => (
                                <li key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.quantity}g</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <span className="text-sm font-bold">{Math.round(item.calories * item.quantity / 100)} kcal</span>
                                      <button onClick={() => setSubstitutingFood(item)} className="text-blue-500 hover:text-blue-700" title="Substituir Alimento">
                                          <RefreshIcon className="w-4 h-4" />
                                      </button>
                                      <button onClick={() => removeFoodFromLog(item.id)} className="text-red-500 hover:text-red-700" title="Remover Alimento">
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {substitutingFood && (
          <FoodSubstitution 
              food={substitutingFood} 
              onClose={() => setSubstitutingFood(null)} 
              onReplace={handleReplace}
          />
      )}
    </>
  );
};

export default Diary;
