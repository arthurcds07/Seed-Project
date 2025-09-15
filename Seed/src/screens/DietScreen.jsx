import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { useDiet } from '../context/DietContext';
import { AuthContext } from '../context/AuthContext';
import { GestureDetector, Gesture } from "react-native-gesture-handler"; 
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    runOnJS,
} from "react-native-reanimated";

import { useNavigation } from '@react-navigation/native';

const DietScreen = () => {
  const navigation = useNavigation();
  const { meals, addMeal, updateMeal, deleteMeal, addFoodToMeal } = useDiet();
  const { userToken, user } = useContext(AuthContext);
  const [foodIdInput, setFoodIdInput] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [newMealName, setNewMealName] = useState('');

  console.log(userToken)

  const handleAddFood = () => {
    if (selectedMeal && foodIdInput) {
      addFoodToMeal(selectedMeal, foodIdInput);
      setFoodIdInput('');
    }
  };

  const handleUpdateMeal = () => {
    if (editingMeal && newMealName.trim()) {
      updateMeal(editingMeal, newMealName);
      setEditingMeal(null);
      setNewMealName('');
    }
  };

  const translateY = useSharedValue(0);
    
  const panGesture = Gesture.Pan() //cria um gesto de arrastar, detectando o movimento do dedo na tela
      .onStart(() => { 
          // Vai executar quando o gesto começar
      })
      .onUpdate((event) => { //serve pra quando 
          if (event.translationY > 0) {
              translateY.value = event.translationY;
          }
      })
      .onEnd((event) => {
          if (event.translationY > 100) {
             runOnJS(navigation.navigate)('Home');
          }
          translateY.value = withSpring(0);
      });

  const animatedStyle = useAnimatedStyle(() => {
      return {
          transform: [{ translateY: translateY.value }],
          opacity: 1 - Math.min(0.5, Math.abs(translateY.value / 200)),
      };
  });


  return (
    
    <View style={styles.container}>
       
    <GestureDetector gesture={panGesture}>
    <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>essa é a tela da rede social!</Text>

      {meals.map(meal => (
        <View key={meal.id} style={styles.mealCard}>
          {editingMeal === meal.id ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={newMealName}
                onChangeText={setNewMealName}
                placeholder="Novo nome da refeição"
                autoFocus
              />
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleUpdateMeal}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.mealTitle}>{meal.name}</Text>
          )}
          
          {meal.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodText}>{food.nome}</Text>
              <Text style={styles.foodMacros}>
                {food.calorias}kcal • P: {food.proteina}g • C: {food.carboidrato}g • G: {food.gordura}g
              </Text>
            </View>
          ))}
          
          <View style={styles.totals}>
            <Text style={styles.totalsText}>
              TOTAL: {meal.totals.calories}kcal • P: {meal.totals.protein}g • C: {meal.totals.carbs}g • G: {meal.totals.fat}g
            </Text>
          </View>

          {selectedMeal === meal.id && (
            <View style={styles.addFoodContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Digite o ID do alimento"
                value={foodIdInput}
                onChangeText={setFoodIdInput}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
                <Text style={styles.ok}>OK</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.mealActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                setSelectedMeal(meal.id);
                setEditingMeal(null);
              }}
            >
              <Text style={styles.actionButtonText}>➕ Alimentos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                setEditingMeal(meal.id);
                setNewMealName(meal.name);
                setSelectedMeal(null);
              }}
            >
              <Text style={styles.actionButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => deleteMeal(meal.id)}
            >
              <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.newMealButton} onPress={addMeal}>
        <Text style={styles.buttonText}>+ Adicionar Refeição</Text>
      </TouchableOpacity>
    <View style={[styles.footer]}>
        <Text>^^^^^^^^^^^^</Text>
        <Text style={styles.hint}>Arraste para baixo!</Text>
    </View>
    </Animated.View>
    </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  mealTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#1C3A13',
  },
  foodItem: {
    backgroundColor: '#F4F8F4',
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
  },
  foodText: {
    fontSize: 14,
    color: '#333',
  },
  foodMacros: {
    fontSize: 12,
    color: '#F57C00',
    marginTop: 2,
  },
  totals: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalsText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1C3A13',
  },
  addFoodContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  addButton: {
    backgroundColor: '#9FD986',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ok: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newMealButton: {
    backgroundColor: '#1C3A13',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FFCDD2',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  saveButton: {
    backgroundColor: '#9FD986',
    padding: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default DietScreen;