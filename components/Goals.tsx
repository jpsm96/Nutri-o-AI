
import React from 'react';
import { UserProfile } from '../types';
import { calculateGET, calculateBMI } from '../utils/calculations';

interface GoalsProps {
  userProfile: UserProfile;
}

const Goals: React.FC<GoalsProps> = ({ userProfile }) => {
  const get = calculateGET(userProfile);
  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const { weight, targetWeight } = userProfile;
  const weightToLose = weight - targetWeight;
  const suggestedDeficit = 500; // Safe deficit of 500 kcal
  const targetCalories = get - suggestedDeficit;
  const daysToGoal = weightToLose > 0 ? Math.round((weightToLose * 7700) / suggestedDeficit) : 0;

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: "Abaixo do peso", color: "text-blue-500" };
    if (bmiValue < 24.9) return { category: "Peso normal", color: "text-emerald-500" };
    if (bmiValue < 29.9) return { category: "Sobrepeso", color: "text-amber-500" };
    return { category: "Obesidade", color: "text-red-500" };
  };

  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Metas & Progresso</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Seu Gasto Energético Total (GET)</h2>
          <p className="text-5xl font-extrabold text-emerald-500 my-2">{get}</p>
          <p className="text-gray-600 dark:text-gray-300">kcal por dia para manter o peso</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Seu IMC (Índice de Massa Corporal)</h2>
          <p className={`text-5xl font-extrabold ${bmiInfo.color} my-2`}>{bmi}</p>
          <p className={`font-semibold ${bmiInfo.color}`}>{bmiInfo.category}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Seu Plano de Perda de Peso</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Peso Atual:</span>
            <span className="text-lg font-bold">{weight} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Peso Alvo:</span>
            <span className="text-lg font-bold text-emerald-500">{targetWeight} kg</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-2">
            <div 
              className="bg-emerald-500 h-4 rounded-full"
              style={{ width: `${(1 - (weightToLose > 0 ? weightToLose / (weight - targetWeight + weightToLose) : 1)) * 100}%` }}
            ></div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700"/>
          {weightToLose > 0 ? (
            <>
              <p className="text-center">Para uma perda de peso segura (aprox. 0.5kg/semana), sugerimos um déficit de <span className="font-bold">{suggestedDeficit} kcal</span>.</p>
              <div className="bg-emerald-50 dark:bg-emerald-900/50 rounded-2xl p-4 text-center">
                <p className="font-semibold text-gray-700 dark:text-gray-200">Sua meta de calorias diárias é:</p>
                <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 my-2">{targetCalories} kcal</p>
              </div>
              <p className="text-center text-sm text-gray-500">
                Mantendo essa meta, a previsão para atingir seu objetivo é de aproximadamente <span className="font-bold">{daysToGoal} dias</span>.
              </p>
            </>
          ) : (
             <p className="text-center font-semibold text-emerald-500">Parabéns, você atingiu seu peso alvo!</p>
          )}
        </div>
        <p className="text-xs text-center text-gray-400 mt-6">Lembre-se: esta é uma estimativa. Consulte um profissional de nutrição para um plano personalizado.</p>
      </div>
    </div>
  );
};

export default Goals;
