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
          const mealsWithFoods = await Promise.all(
            result.data.map(async (meal) => {
              const foodsResponse = await fetch(`${API_ENDPOINTS.FOODS}/food/${meal.id}`);
              const foodsResult = await foodsResponse.json();

              const foods = foodsResult.success ? foodsResult.data.map(food => ({
                ...food,
                calorias: (Number(food.calorias) * food.quantidade) / 100,
                proteina: (Number(food.proteina) * food.quantidade) / 100,
                carboidrato: (Number(food.carboidrato) * food.quantidade) / 100,
                gordura: (Number(food.gordura) * food.quantidade) / 100
              })) : [];

              const totals = calculateTotals(foods);

              return {
                id: meal.id,
                name: meal.nome,
                foods,
                totals
              };
            })
          );

          setMeals(mealsWithFoods);
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

  const deleteMeal = async (mealId) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_MEAL(mealId), {
        method: 'DELETE'
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      setMeals(meals.filter(meal => meal.id !== mealId));
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
      Alert.alert("Erro", "Não foi possível excluir a refeição");
    }
  };



  const addFoodToMeal = async (mealId, foodId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FOODS}/${foodId}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Erro ao buscar alimento");

      const foodData = {
        ...result.data,
        quantidade: 100 // padrão
      };

      await fetch(`${API_ENDPOINTS.FOODS}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_alimento: foodId,
          id_refeicao: mealId,
          quantidade: 100
        })
      });

      setMeals(meals.map(meal => {
        if (meal.id === mealId) {
          const updatedFoods = [...meal.foods, foodData];
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
    calories: totals.calories + (Number(food.calorias) || 0),
    protein: totals.protein + (Number(food.proteina) || 0),
    carbs: totals.carbs + (Number(food.carboidrato) || 0),
    fat: totals.fat + (Number(food.gordura) || 0)
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