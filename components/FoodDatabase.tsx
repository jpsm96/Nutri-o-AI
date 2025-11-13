
import React, { useState } from 'react';
import { foodDatabase } from '../data/foods';
import { Food, MealType } from '../types';

interface FoodDatabaseProps {
    addFoodToLog: (food: Food, quantity: number, meal: MealType) => void;
}

const FoodDatabase: React.FC<FoodDatabaseProps> = ({ addFoodToLog }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFoods = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // This component is currently not linked in the main navigation
    // but demonstrates the capability to browse the full food table.

    return (
        <div className="py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Tabela de Alimentos</h1>
            <input 
                type="text"
                placeholder="Buscar na tabela TACO/IBGE..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 mb-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl"
            />
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alimento</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calorias</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proteínas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredFoods.map(food => (
                            <tr key={food.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{food.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{food.calories}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{food.protein}g</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodDatabase;
