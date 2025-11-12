//este arquivo é responsável por gerenciar o estado da dieta do usuário
//ele fornece funções para adicionar, atualizar e remover refeições e alimentos

//o arquivo armazenna os dados na memória do state!

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_ENDPOINTS } from '../config/api';
import { AuthContext } from './AuthContext';

const DietContext = createContext();

export const DietProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
  const fetchMeals = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FOODS}/meal/${user.id}`);
      const result = await response.json();
      if (result.success) {
        // Mapear refeições do banco para o formato local
        const loadedMeals = result.data.map(meal => ({
          id: meal.id,
          name: meal.nome,
          foods: [], // pode carregar depois com outra rota
          totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
        }));
        setMeals(loadedMeals);
      }
    } catch (error) {
      console.error("Erro ao carregar refeições:", error);
    }
  };

  if (user?.id) fetchMeals();
}, [user]);


  const addMeal = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FOODS}/meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id, // vem do AuthContext
          nome: `Refeição ${meals.length + 1}`
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      const newMeal = {
        id: result.mealId, // ID real do banco
        name: `Refeição ${meals.length + 1}`,
        foods: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      };

      setMeals([...meals, newMeal]);
    } catch (error) {
      console.error("Erro ao criar refeição:", error);
      Alert.alert("Erro", "Não foi possível criar a refeição");
    }
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
    // Buscar alimento por ID
    const response = await fetch(`${API_ENDPOINTS.FOODS}/${foodId}`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Erro ao buscar alimento");

    // Persistir no banco
    await fetch(`${API_ENDPOINTS.FOODS}/food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_alimento: foodId,
        id_refeicao: mealId, // precisa ser o ID real do banco
        quantidade: 1
      })
    });

    // Atualizar estado local
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