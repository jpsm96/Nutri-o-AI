import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProfile, Food, LoggedFood, Screen, MealType, DailyLog } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AddMealFlow from './components/AddMealFlow';
import Diary from './components/Diary';
import Goals from './components/Goals';
import Profile from './components/Profile';
import FoodDatabase from './components/FoodDatabase';
import { Navigation, HomeIcon, PlusCircleIcon, BookOpenIcon, ChartBarIcon, UserIcon } from './components/Icons';
import { calculateGET } from './utils/calculations';

const App: React.FC = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [dailyLog, setDailyLog] = useLocalStorage<DailyLog>('dailyLog', {});
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const today = new Date().toISOString().split('T')[0];

  const todaysLog = useMemo(() => dailyLog[today] || [], [dailyLog, today]);

  const addFoodToLog = (food: Food, quantity: number, meal: MealType) => {
    const newLoggedFood: LoggedFood = {
      ...food,
      id: `${food.id}-${Date.now()}`,
      quantity,
      meal,
      timestamp: new Date().toISOString(),
    };
    
    const logForToday = dailyLog[today] ? [...dailyLog[today], newLoggedFood] : [newLoggedFood];

    setDailyLog(prevLog => ({
      ...prevLog,
      [today]: logForToday,
    }));
  };
  
  const removeFoodFromLog = (loggedFoodId: string) => {
    const updatedLogForToday = (dailyLog[today] || []).filter(item => item.id !== loggedFoodId);
    setDailyLog(prevLog => ({
      ...prevLog,
      [today]: updatedLogForToday,
    }));
  };
  
  const replaceFoodInLog = (loggedFoodId: string, newFood: Food) => {
    const todaysLog = dailyLog[today] || [];
    const oldFoodItem = todaysLog.find(item => item.id === loggedFoodId);
    
    if (!oldFoodItem) return;

    const newLoggedFood: LoggedFood = {
        ...newFood,
        id: `${newFood.id}-${Date.now()}`,
        quantity: oldFoodItem.quantity,
        meal: oldFoodItem.meal,
        timestamp: oldFoodItem.timestamp,
    };
    
    const updatedLogForToday = todaysLog.map(item => item.id === loggedFoodId ? newLoggedFood : item);

    setDailyLog(prevLog => ({
        ...prevLog,
        [today]: updatedLogForToday,
    }));
  };

  if (!profile) {
    return <Onboarding setProfile={setProfile} setScreen={setScreen} />;
  }
  
  const get = calculateGET(profile);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard userProfile={profile} todaysLog={todaysLog} get={get} />;
      case 'add-meal':
        return <AddMealFlow addFoodToLog={addFoodToLog} setScreen={setScreen} />;
      case 'diary':
        return <Diary dailyLog={dailyLog} removeFoodFromLog={removeFoodFromLog} replaceFoodInLog={replaceFoodInLog} />;
      case 'goals':
        return <Goals userProfile={profile} />;
      case 'database':
        return <FoodDatabase addFoodToLog={addFoodToLog} />;
      case 'profile':
        return <Profile profile={profile} setProfile={setProfile} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:
        return <Dashboard userProfile={profile} todaysLog={todaysLog} get={get} />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col">
      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {renderScreen()}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <nav className="flex justify-around max-w-4xl mx-auto px-2 py-2">
          <Navigation text="Início" icon={<HomeIcon />} onClick={() => setScreen('dashboard')} active={screen === 'dashboard'} />
          <Navigation text="Adicionar" icon={<PlusCircleIcon />} onClick={() => setScreen('add-meal')} active={screen === 'add-meal'} />
          <Navigation text="Diário" icon={<BookOpenIcon />} onClick={() => setScreen('diary')} active={screen === 'diary'} />
          <Navigation text="Metas" icon={<ChartBarIcon />} onClick={() => setScreen('goals')} active={screen === 'goals'} />
          <Navigation text="Perfil" icon={<UserIcon />} onClick={() => setScreen('profile')} active={screen === 'profile'} />
        </nav>
      </footer>
    </div>
  );
};

export default App;
