
import React, { useState } from 'react';
import { Food, LoggedFood, MealType, Screen, IdentifiedFood } from '../types';
import { CameraIcon, PencilIcon } from './Icons';
import { analyzeImageWithGemini } from '../services/geminiService';
import Spinner from './shared/Spinner';
import { foodDatabase } from '../data/foods';

interface AddMealFlowProps {
  addFoodToLog: (food: Food, quantity: number, meal: MealType) => void;
  setScreen: (screen: Screen) => void;
}

const MealSelection: React.FC<{ onSelect: (meal: MealType) => void }> = ({ onSelect }) => {
  const meals: MealType[] = ['Café da Manhã', 'Almoço', 'Jantar', 'Lanches'];
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Qual refeição você está adicionando?</h2>
      <div className="grid grid-cols-2 gap-4">
        {meals.map(meal => (
          <button
            key={meal}
            onClick={() => onSelect(meal)}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <span className="text-lg font-semibold">{meal}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AddMethodSelection: React.FC<{ onSelect: (method: 'photo' | 'manual') => void }> = ({ onSelect }) => (
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-6">Como você quer adicionar?</h2>
    <div className="flex flex-col md:flex-row gap-6">
      <button onClick={() => onSelect('photo')} className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all">
        <CameraIcon className="w-12 h-12 text-emerald-500 mb-4" />
        <span className="text-lg font-semibold">Analisar com Foto</span>
        <span className="text-sm text-gray-500">Use a IA para identificar</span>
      </button>
      <button onClick={() => onSelect('manual')} className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
        <PencilIcon className="w-12 h-12 text-blue-500 mb-4" />
        <span className="text-lg font-semibold">Adicionar Manualmente</span>
        <span className="text-sm text-gray-500">Busque na nossa base</span>
      </button>
    </div>
  </div>
);

const PhotoAnalysis: React.FC<{ onAnalysisComplete: (foods: IdentifiedFood[]) => void, onBack: () => void }> = ({ onAnalysisComplete, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !image) return;
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = image.split(',')[1];
      const result = await analyzeImageWithGemini(base64Image, imageFile.type);
      onAnalysisComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Análise de Refeição por IA</h2>
      <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
      
      {image && <img src={image} alt="Pré-visualização da refeição" className="mt-4 rounded-2xl max-h-64 w-auto mx-auto" />}
      
      {isLoading && <div className="mt-6"><Spinner text="Analisando sua refeição... Isso pode levar um momento." /></div>}
      
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-400">Voltar</button>
        <button onClick={handleAnalyze} disabled={!image || isLoading} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700 disabled:bg-gray-400">
          {isLoading ? 'Analisando...' : 'Analisar'}
        </button>
      </div>
       <p className="text-xs text-gray-500 mt-4 text-center">Ao enviar a foto, você concorda com nossa política de privacidade sobre o uso de imagens para análise por IA.</p>
    </div>
  );
};

const findFoodInDb = (name: string): Food | undefined => {
    const normalizedName = name.toLowerCase().trim();
    return foodDatabase.find(f => f.name.toLowerCase().includes(normalizedName.split(',')[0]));
};

const AnalysisResults: React.FC<{
  results: IdentifiedFood[];
  meal: MealType;
  addFoodToLog: AddMealFlowProps['addFoodToLog'];
  setScreen: AddMealFlowProps['setScreen'];
  onBack: () => void;
}> = ({ results, meal, addFoodToLog, setScreen, onBack }) => {
  const [editableResults, setEditableResults] = useState(results);

  const handleAddAll = () => {
    editableResults.forEach(item => {
      const foodMatch = findFoodInDb(item.foodName);
      if (foodMatch) {
        addFoodToLog(foodMatch, item.quantityGrams, meal);
      }
    });
    setScreen('dashboard');
  };
  
  const handleQuantityChange = (index: number, value: string) => {
    const newResults = [...editableResults];
    newResults[index].quantityGrams = parseInt(value) || 0;
    setEditableResults(newResults);
  };
  
  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Resultados da Análise</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Verifique e ajuste os alimentos e quantidades identificados pela IA.</p>
        <ul className="space-y-3">
            {editableResults.map((item, index) => {
                const foodMatch = findFoodInDb(item.foodName);
                return (
                    <li key={index} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{item.foodName}</span>
                            <div className="flex items-center">
                                <input 
                                    type="number" 
                                    value={item.quantityGrams}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="w-20 text-right px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                                <span className="ml-2 text-sm text-gray-500">g</span>
                            </div>
                        </div>
                        { !foodMatch && <p className="text-xs text-amber-600 mt-1">Alimento não encontrado na base. Será ignorado.</p> }
                    </li>
                );
            })}
        </ul>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-400">Analisar Outra</button>
            <button onClick={handleAddAll} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700">Adicionar à Refeição</button>
        </div>
    </div>
  );
};

const ManualAdd: React.FC<{
  meal: MealType;
  addFoodToLog: AddMealFlowProps['addFoodToLog'];
  setScreen: AddMealFlowProps['setScreen'];
}> = ({ meal, addFoodToLog, setScreen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState(100);

    const filteredFoods = searchTerm ? foodDatabase.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    const handleAdd = () => {
        if (selectedFood) {
            addFoodToLog(selectedFood, quantity, meal);
            setScreen('dashboard');
        }
    };

    if (selectedFood) {
        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">{selectedFood.name}</h2>
                 <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Quantidade (g)</label>
                    <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm"/>
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p><strong>Calorias:</strong> {Math.round(selectedFood.calories * (quantity/100))} kcal</p>
                    <p><strong>Proteínas:</strong> {Math.round(selectedFood.protein * (quantity/100))} g</p>
                    <p><strong>Carboidratos:</strong> {Math.round(selectedFood.carbs * (quantity/100))} g</p>
                    <p><strong>Gorduras:</strong> {Math.round(selectedFood.fat * (quantity/100))} g</p>
                </div>
                 <div className="flex justify-between mt-6">
                    <button onClick={() => setSelectedFood(null)} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-xl hover:bg-gray-400">Voltar</button>
                    <button onClick={handleAdd} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-emerald-700">Adicionar</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Adicionar Alimento Manualmente</h2>
            <input type="text" placeholder="Busque por um alimento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl"/>
            <ul className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {filteredFoods.map(food => (
                    <li key={food.id} onClick={() => setSelectedFood(food)} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-700">
                        {food.name}
                    </li>
                ))}
            </ul>
        </div>
    )
};


const AddMealFlow: React.FC<AddMealFlowProps> = (props) => {
  const [step, setStep] = useState<'meal' | 'method' | 'photo' | 'results' | 'manual'>('meal');
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [analysisResults, setAnalysisResults] = useState<IdentifiedFood[]>([]);

  const handleMealSelect = (meal: MealType) => {
    setSelectedMeal(meal);
    setStep('method');
  };

  const handleMethodSelect = (method: 'photo' | 'manual') => {
    setStep(method);
  };
  
  const handleAnalysisComplete = (foods: IdentifiedFood[]) => {
      setAnalysisResults(foods);
      setStep('results');
  }

  const resetFlow = () => {
    setStep('method');
  }
  
  const renderCurrentStep = () => {
    switch (step) {
      case 'meal':
        return <MealSelection onSelect={handleMealSelect} />;
      case 'method':
        return <AddMethodSelection onSelect={handleMethodSelect} />;
      case 'photo':
        return <PhotoAnalysis onAnalysisComplete={handleAnalysisComplete} onBack={() => setStep('method')} />;
      case 'results':
        return <AnalysisResults results={analysisResults} meal={selectedMeal!} addFoodToLog={props.addFoodToLog} setScreen={props.setScreen} onBack={resetFlow} />;
      case 'manual':
        return <ManualAdd meal={selectedMeal!} addFoodToLog={props.addFoodToLog} setScreen={props.setScreen} />;
      default:
        return null;
    }
  };

  return <div className="py-8">{renderCurrentStep()}</div>;
};

export default AddMealFlow;
