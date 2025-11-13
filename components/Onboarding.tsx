
import React, { useState } from 'react';
import { UserProfile, ActivityLevel, Screen } from '../types';

interface OnboardingProps {
  setProfile: (profile: UserProfile) => void;
  setScreen: (screen: Screen) => void;
}

const activityLevels = [
  { key: 'Sedentary', value: ActivityLevel.Sedentary, label: 'Sedentário (pouco ou nenhum exercício)' },
  { key: 'LightlyActive', value: ActivityLevel.LightlyActive, label: 'Levemente Ativo (exercício leve 1-3 dias/semana)' },
  { key: 'ModeratelyActive', value: ActivityLevel.ModeratelyActive, label: 'Moderadamente Ativo (exercício moderado 3-5 dias/semana)' },
  { key: 'VeryActive', value: ActivityLevel.VeryActive, label: 'Muito Ativo (exercício intenso 6-7 dias/semana)' },
  { key: 'ExtraActive', value: ActivityLevel.ExtraActive, label: 'Extremamente Ativo (trabalho físico/exercício muito intenso)' },
];

const Onboarding: React.FC<OnboardingProps> = ({ setProfile, setScreen }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'female' as 'male' | 'female',
    height: '',
    weight: '',
    activityLevel: ActivityLevel.LightlyActive,
    targetWeight: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      activityLevel: parseFloat(formData.activityLevel.toString()) as ActivityLevel,
      targetWeight: parseFloat(formData.targetWeight),
    };
    setProfile(profile);
    setScreen('dashboard');
  };
  
  const isStep1Valid = formData.name && formData.age;
  const isStep2Valid = formData.height && formData.weight;
  const isStep3Valid = formData.targetWeight;

  return (
    <div className="min-h-screen bg-emerald-500 dark:bg-emerald-800 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400">Bem-vindo ao NutriAI</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">Vamos configurar seu perfil para começar.</p>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-center">Sobre Você</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Idade</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Gênero</label>
              <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                <option value="female">Feminino</option>
                <option value="male">Masculino</option>
              </select>
            </div>
            <button onClick={nextStep} disabled={!isStep1Valid} className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700 transition duration-300 disabled:bg-gray-400">Próximo</button>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-center">Suas Medidas</h2>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Altura (cm)</label>
              <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Peso (kg)</label>
              <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-400 transition duration-300">Voltar</button>
              <button onClick={nextStep} disabled={!isStep2Valid} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700 transition duration-300 disabled:bg-gray-400">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-center">Seus Objetivos</h2>
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nível de Atividade</label>
              <select name="activityLevel" id="activityLevel" value={formData.activityLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                {activityLevels.map(level => (
                  <option key={level.key} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Peso Alvo (kg)</label>
              <input type="number" name="targetWeight" id="targetWeight" value={formData.targetWeight} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-400 transition duration-300">Voltar</button>
              <button onClick={handleSubmit} disabled={!isStep3Valid} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700 transition duration-300 disabled:bg-gray-400">Concluir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
