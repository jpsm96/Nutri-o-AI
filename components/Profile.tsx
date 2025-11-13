
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile, isDarkMode, setIsDarkMode }) => {
    // In a real app, you would have a form here to edit the profile.
    // For this example, we will just display the information.

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Seu Perfil</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div>
            <label className="text-sm font-semibold text-gray-500">Nome</label>
            <p className="text-lg">{profile.name}</p>
        </div>
        <hr className="border-gray-200 dark:border-gray-700"/>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-semibold text-gray-500">Idade</label>
                <p className="text-lg">{profile.age} anos</p>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-500">Gênero</label>
                <p className="text-lg">{profile.gender === 'male' ? 'Masculino' : 'Feminino'}</p>
            </div>
             <div>
                <label className="text-sm font-semibold text-gray-500">Altura</label>
                <p className="text-lg">{profile.height} cm</p>
            </div>
             <div>
                <label className="text-sm font-semibold text-gray-500">Peso</label>
                <p className="text-lg">{profile.weight} kg</p>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Configurações</h2>
        <div className="flex justify-between items-center">
            <span className="font-semibold">Modo Escuro</span>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-200'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
      </div>
       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-2">Política de Privacidade</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
            Respeitamos sua privacidade. Seus dados são salvos apenas no seu dispositivo. As fotos enviadas para análise são processadas por uma IA e não são armazenadas. Ao usar o app, você concorda com nossos termos.
        </p>
      </div>
    </div>
  );
};

export default Profile;
