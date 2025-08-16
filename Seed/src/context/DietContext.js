//este arquivo é responsável por gerenciar o estado da dieta do usuário
//ele fornece funções para adicionar, atualizar e remover refeições e alimentos

//o arquivo armazenna os dados na memória do state!

import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const DietContext = createContext();

export const DietProvider = ({ children, user }) => {
  const [meals, setMeals] = useState([]);

  const addMeal = () => {
    const newMeal = {
      id: Date.now().toString(),
      name: `Refeição ${meals.length + 1}`,
      foods: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
    setMeals([...meals, newMeal]);
  };

  const updateMeal = (mealId, newName) => {
    setMeals(meals.map(meal => 
      meal.id === mealId ? { ...meal, name: newName } : meal
    ));
  };

  const deleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const addFoodToMeal = async (mealId, foodId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FOODS}/${foodId}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Erro ao buscar alimento");
      }

      setMeals(meals.map(meal => {
        if (meal.id === mealId) {
          const updatedFoods = [...meal.foods, result.data];
          const totals = calculateTotals(updatedFoods);
          return { ...meal, foods: updatedFoods, totals };
        }
        return meal;
      }));
    } catch (error) {
      console.error("Erro detalhado:", error);
      Alert.alert("Erro", `Não foi possível adicionar o alimento: ${error.message}`);
    }
  };

  const calculateTotals = (foods) => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + (food.calorias || 0),
      protein: totals.protein + (food.proteina || 0),
      carbs: totals.carbs + (food.carboidrato || 0),
      fat: totals.fat + (food.gordura || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <DietContext.Provider value={{ 
      meals, 
      addMeal, 
      updateMeal,
      deleteMeal,
      addFoodToMeal 
    }}>
      {children}
    </DietContext.Provider>
  );
};

export const useDiet = () => useContext(DietContext);