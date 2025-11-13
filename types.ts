
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  targetWeight: number;
}

export enum ActivityLevel {
  Sedentary = 1.2,
  LightlyActive = 1.375,
  ModeratelyActive = 1.55,
  VeryActive = 1.725,
  ExtraActive = 1.9,
}

export interface Food {
  id: number;
  name: string;
  source: 'TACO' | 'IBGE 2025';
  calories: number; // per 100g
  protein: number; // per 100g
  carbs: number; // per 100g
  fat: number; // per 100g
  // Micronutrients per 100g
  fiber?: number;
  sodium?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  zinc?: number; // mg
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
}

// FIX: Redefined LoggedFood to not extend Food, as the 'id' property type is incompatible.
// This new definition accurately represents the shape of a logged food item.
export interface LoggedFood {
  id: string; // Unique ID for the logged instance
  name: string;
  source: 'TACO' | 'IBGE 2025';
  calories: number; // per 100g
  protein: number; // per 100g
  carbs: number; // per 100g
  fat: number; // per 100g
  // Micronutrients per 100g
  fiber?: number;
  sodium?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  zinc?: number; // mg
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  // LoggedFood-specific properties
  quantity: number; // in grams
  meal: MealType;
  timestamp: string;
}

export type MealType = 'Café da Manhã' | 'Almoço' | 'Jantar' | 'Lanches';

export type Screen = 'onboarding' | 'dashboard' | 'add-meal' | 'diary' | 'goals' | 'profile' | 'database';

export interface DailyLog {
  [date: string]: LoggedFood[];
}

export interface IdentifiedFood {
  foodName: string;
  quantityGrams: number;
}