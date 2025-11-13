
import React from 'react';
import { UserProfile, LoggedFood } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  userProfile: UserProfile;
  todaysLog: LoggedFood[];
  get: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, todaysLog, get }) => {
  const consumed = todaysLog.reduce((acc, item) => {
    const multiplier = item.quantity / 100;
    return {
      calories: acc.calories + item.calories * multiplier,
      protein: acc.protein + item.protein * multiplier,
      carbs: acc.carbs + item.carbs * multiplier,
      fat: acc.fat + item.fat * multiplier,
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remainingCalories = get - consumed.calories;

  const macroData = [
    { name: 'Carbs', value: Math.round(consumed.carbs) },
    { name: 'Proteínas', value: Math.round(consumed.protein) },
    { name: 'Gorduras', value: Math.round(consumed.fat) },
  ];

  const COLORS = ['#34D399', '#60A5FA', '#FBBF24']; // Emerald, Blue, Amber

  const recentItems = todaysLog.slice(-4).reverse();

  return (
    <div className="py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Olá, {userProfile.name}!</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Aqui está seu resumo de hoje.</p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200 dark:text-gray-700"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-emerald-500"
              strokeDasharray={`${Math.min(100, (consumed.calories / get) * 100)}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{Math.round(consumed.calories)}</span>
            <span className="text-sm text-gray-500">kcal</span>
          </div>
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0 md:ml-6">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Meta diária</p>
            <p className="text-2xl font-bold">{get} kcal</p>
            <p className="text-emerald-500 font-semibold mt-2">{Math.round(Math.max(0, remainingCalories))} kcal restantes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Macronutrientes (g)</h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}g`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
           <div className="flex justify-around mt-4">
            {macroData.map((item, index) => (
                <div key={item.name} className="text-center">
                    <p className="flex items-center font-bold">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
                        {item.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.value}g</p>
                </div>
            ))}
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
           <h2 className="text-xl font-bold mb-4">Adicionados Recentemente</h2>
           {recentItems.length > 0 ? (
             <ul className="space-y-3">
               {recentItems.map(item => (
                 <li key={item.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <div>
                     <p className="font-semibold">{item.name}</p>
                     <p className="text-xs text-gray-500">{item.quantity}g - {item.meal}</p>
                   </div>
                   <span className="font-bold text-emerald-500">{Math.round(item.calories * (item.quantity / 100))} kcal</span>
                 </li>
               ))}
             </ul>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p>Nenhum alimento adicionado hoje.</p>
                <p className="text-sm">Clique em "Adicionar" para começar!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
