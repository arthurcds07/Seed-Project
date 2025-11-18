import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image
} from 'react-native';
import { useDiet } from '../context/DietContext';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import DrawerMenu from "../components/DrawerMenu";


const DietScreen = () => {
  const { meals, addMeal, updateMeal, deleteMeal, addFoodToMeal, updateFoodQuantity } = useDiet();
  const { user } = useContext(AuthContext);

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [newMealName, setNewMealName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  //quantidade de um alimento
  const [editingFood, setEditingFood] = useState(null);
  const [tempQuantity, setTempQuantity] = useState('');

  
  const apiBase = API_ENDPOINTS.GETUSER.replace('/user', '');
  const profileImageUri = user?.profile_picture_url
    ? (user.profile_picture_url.startsWith('http') ? user.profile_picture_url : `${apiBase}${user.profile_picture_url}`)
    : 'https://via.placeholder.com/150';

  // alimentos por nome
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <DrawerMenu />  
      {/* foto de perfil */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileImageUri }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.username || 'Usuário'}</Text>
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
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={styles.foodText}>{food.nome} — {food.quantidade}g</Text>

                {/* botão para abrir edição de quantidade */}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    setEditingFood({ mealId: meal.id, foodId: food.id });
                    setTempQuantity(String(food.quantidade));
                    setSelectedMeal(null);
                  }}
                >
                  <Image source={require('../../assets/edit.png')} style={styles.quantityIcon} />
                  <Text style={styles.quantityLabel}>Quant.</Text>
                </TouchableOpacity>
              </View>

              {/* campo inline para editar quantidade do alimento */}
              {editingFood && editingFood.mealId === meal.id && editingFood.foodId === food.id ? (
                <View style={{flexDirection:'row', alignItems:'center', marginTop:8}}>
                  <TextInput
                    style={[styles.input, {flex:1}]}
                    keyboardType="numeric"
                    value={tempQuantity}
                    onChangeText={setTempQuantity}
                    placeholder="Quantidade (g)"
                  />
                  <TouchableOpacity style={[styles.saveButton, {marginLeft:8}]} onPress={() => {
                    const q = Number(tempQuantity) || 0;
                    if (q > 0) {
                      updateFoodQuantity(meal.id, food.id, q);
                    }
                    setEditingFood(null);
                    setTempQuantity('');
                  }}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:8}} onPress={() => { setEditingFood(null); setTempQuantity(''); }}>
                    <Text style={{color:'#888'}}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <Text style={styles.foodMacros}>
                {Math.round(food.calorias*100)/100}kcal • P: {Math.round(food.proteina*100)/100}g • C: {Math.round(food.carboidrato*100)/100}g • G: {Math.round(food.gordura*100)/100}g
              </Text>
            </View>
          ))}

          {/* totais da refeição */}
          <View style={styles.totalsBlock}>
            <Text style={styles.totalsTitle}>Total da refeição:</Text>
            <Text style={styles.totalsLine}>Calorias: {Math.round(meal.totals.calories*100)/100} kcal</Text>
            <Text style={styles.totalsLine}>Proteína: {Math.round(meal.totals.protein*100)/100} g</Text>
            <Text style={styles.totalsLine}>Carboidrato: {Math.round(meal.totals.carbs*100)/100} g</Text>
            <Text style={styles.totalsLine}>Gordura: {Math.round(meal.totals.fat*100)/100} g</Text>
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
            <TouchableOpacity style={styles.actionButton} onPress={() => setSelectedMeal(meal.id)}>
              <Image source={require('../../assets/add.png')} style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Alimentos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => {
              setEditingMeal(meal.id);
              setNewMealName(meal.name);
              setSelectedMeal(null);
            }}>
              <Image source={require('../../assets/edit.png')} style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => deleteMeal(meal.id)}>
              <Image source={require('../../assets/delete.png')} style={styles.actionIcon} />
              <Text style={[styles.actionLabel, styles.deleteLabel]}>Excluir</Text>
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
  // garante que o ScrollView cubra toda a tela e mantenha a cor de fundo
  screen: {
    flex: 1,
    backgroundColor: '#F5FFF0',
  },
  container: {
    padding: 16,
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 14,
    color: '#1C3A13',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteLabel: {
    color: 'red',
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
  quantityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
  },
  quantityIcon: {
    width: 14,
    height: 14,
    marginBottom: 4,
    tintColor: '#1C3A13',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#1C3A13',
    textAlign: 'center',
  },
});

export default DietScreen;
