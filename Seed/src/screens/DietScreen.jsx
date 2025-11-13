import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image
} from 'react-native';
import { useDiet } from '../context/DietContext';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const DietScreen = () => {
  const { meals, addMeal, updateMeal, deleteMeal, addFoodToMeal } = useDiet();
  const { user } = useContext(AuthContext);

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [newMealName, setNewMealName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 Buscar sugestões de alimentos por nome
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.FOODS}/search?q=${searchTerm}`);
        const result = await response.json();
        if (result.success) setSuggestions(result.data);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleUpdateMeal = () => {
    if (editingMeal && newMealName.trim()) {
      updateMeal(editingMeal, newMealName);
      setEditingMeal(null);
      setNewMealName('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* foto de perfil */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
      </View>

      {/* refeições */}
      {meals.map(meal => (
        <View key={meal.id} style={styles.mealCard}>
          {editingMeal === meal.id ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={newMealName}
                onChangeText={setNewMealName}
                placeholder="Novo nome da refeição"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateMeal}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.mealTitle}>{meal.name}</Text>
          )}

          {/* alimentos da refeição */}
          {meal.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodText}>{food.nome}</Text>
              <Text style={styles.foodMacros}>
                {food.calorias}kcal • P: {food.proteina}g • C: {food.carboidrato}g • G: {food.gordura}g
              </Text>
            </View>
          ))}

          {/* totais da refeição */}
          <View style={styles.totalsBlock}>
            <Text style={styles.totalsTitle}>Total da refeição:</Text>
            <Text style={styles.totalsLine}>Calorias: {meal.totals.calories} kcal</Text>
            <Text style={styles.totalsLine}>Proteína: {meal.totals.protein} g</Text>
            <Text style={styles.totalsLine}>Carboidrato: {meal.totals.carbs} g</Text>
            <Text style={styles.totalsLine}>Gordura: {meal.totals.fat} g</Text>
          </View>

          {/* cmpo de busca de alimentos */}
          {selectedMeal === meal.id && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Buscar alimento..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              {suggestions.map(food => (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => {
                    addFoodToMeal(meal.id, food.id);
                    setSearchTerm('');
                    setSuggestions([]);
                  }}
                  style={styles.suggestionItem}
                >
                  <Text>{food.nome}</Text>
                  <Text style={styles.suggestionMacros}>
                    {food.calorias}kcal • P: {food.proteina}g • C: {food.carboidrato}g • G: {food.gordura}g
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ⚙️ Ações da refeição */}
          <View style={styles.mealActions}>
            <TouchableOpacity onPress={() => setSelectedMeal(meal.id)}>
              <Text style={styles.action}>➕ Alimentos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setEditingMeal(meal.id);
              setNewMealName(meal.name);
              setSelectedMeal(null);
            }}>
              <Text style={styles.action}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
              <Text style={[styles.action, { color: 'red' }]}>🗑️ Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* ➕ Adicionar nova refeição */}
      <TouchableOpacity style={styles.newMealButton} onPress={addMeal}>
        <Text style={styles.buttonText}>+ Adicionar Refeição</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5FFF0',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  foodItem: {
    marginBottom: 6,
  },
  foodText: {
    fontSize: 16,
  },
  foodMacros: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginBottom: 6,
  },
  suggestionMacros: {
    fontSize: 12,
    color: '#666',
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  action: {
    fontSize: 14,
    color: '#1C3A13',
    fontWeight: 'bold',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#4EA12C',
    padding: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  newMealButton: {
    backgroundColor: '#1C3A13',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  totalsBlock: {
    marginTop: 10,
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
  },
  totalsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalsLine: {
    fontSize: 14,
    color: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DietScreen;
