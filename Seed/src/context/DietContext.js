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

              const foods = foodsResult.success ? foodsResult.data.map(food => {
                // manter valores "base" por 100g para permitir recalculo
                const base_calorias = Number(food.calorias || 0);
                const base_proteina = Number(food.proteina || 0);
                const base_carboidrato = Number(food.carboidrato || 0);
                const base_gordura = Number(food.gordura || 0);
                const quantidade = Number(food.quantidade) || 100;

                const calorias = (base_calorias * quantidade) / 100;
                const proteina = (base_proteina * quantidade) / 100;
                const carboidrato = (base_carboidrato * quantidade) / 100;
                const gordura = (base_gordura * quantidade) / 100;

                return {
                  id: food.id, // id da tabela AlimentosRefeicoes (ar.id)
                  id_alimento: food.id_alimento,
                  nome: food.nome,
                  quantidade,
                  base_calorias,
                  base_proteina,
                  base_carboidrato,
                  base_gordura,
                  calorias,
                  proteina,
                  carboidrato,
                  gordura,
                  unidade_medida: food.unidade_medida
                };
              }) : [];

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
      // 1) cria o registro na tabela AlimentosRefeicoes para obter o id (foodMealId)
      const createRes = await fetch(`${API_ENDPOINTS.FOODS}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_alimento: foodId,
          id_refeicao: mealId,
          quantidade: 100
        })
      });
      const createResult = await createRes.json();
      if (!createResult.success) throw new Error(createResult.message || "Erro ao adicionar alimento");

      const foodMealId = createResult.foodMealId;

      // 2) buscar dados base do alimento (por 100g)
      const response = await fetch(`${API_ENDPOINTS.FOODS}/${foodId}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Erro ao buscar alimento");

      const base_calorias = Number(result.data.calorias || 0);
      const base_proteina = Number(result.data.proteina || 0);
      const base_carboidrato = Number(result.data.carboidrato || 0);
      const base_gordura = Number(result.data.gordura || 0);
      const quantidade = 100;

      const foodData = {
        id: foodMealId, // id da tabela AlimentosRefeicoes
        id_alimento: foodId,
        nome: result.data.nome,
        quantidade,
        base_calorias,
        base_proteina,
        base_carboidrato,
        base_gordura,
        calorias: (base_calorias * quantidade) / 100,
        proteina: (base_proteina * quantidade) / 100,
        carboidrato: (base_carboidrato * quantidade) / 100,
        gordura: (base_gordura * quantidade) / 100,
        unidade_medida: result.data.unidade_medida
      };

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

  const updateFoodQuantity = async (mealId, foodMealId, newQuantity) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.FOODS}/food/${foodMealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: Number(newQuantity) })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Erro ao atualizar quantidade");

      setMeals(meals.map(meal => {
        if (meal.id === mealId) {
          const updatedFoods = meal.foods.map(food => {
            if (food.id === foodMealId) {
              const quantidade = Number(newQuantity);
              const calorias = (food.base_calorias * quantidade) / 100;
              const proteina = (food.base_proteina * quantidade) / 100;
              const carboidrato = (food.base_carboidrato * quantidade) / 100;
              const gordura = (food.base_gordura * quantidade) / 100;
              return { ...food, quantidade, calorias, proteina, carboidrato, gordura };
            }
            return food;
          });
          return { ...meal, foods: updatedFoods, totals: calculateTotals(updatedFoods) };
        }
        return meal;
      }));
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      Alert.alert("Erro", `Não foi possível atualizar a quantidade: ${error.message}`);
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
      addFoodToMeal,
      updateFoodQuantity // <-- exposto para UI
    }}>
      {children}
    </DietContext.Provider>
  );
};

export const useDiet = () => useContext(DietContext);