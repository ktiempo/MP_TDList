import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  // Function to add a new task
  const addTask = () => {
    if (task.trim()) {
      setTaskList([...taskList, { id: Date.now().toString(), task }]);
      setTask('');
    }
  };

  // Function to delete a task
  const deleteTask = (id) => {
    setTaskList(taskList.filter((item) => item.id !== id));
  };

  // Open the modal for editing a task
  const editTask = (item) => {
    setIsEdit(true);
    setTaskToEdit(item);
    setTask(item.task);
    setModalVisible(true);
  };

  // Function to update a task
  const updateTask = () => {
    if (task.trim()) {
      const updatedTasks = taskList.map((item) =>
        item.id === taskToEdit.id ? { ...item, task } : item
      );
      setTaskList(updatedTasks);
      setTask('');
      setIsEdit(false);
      setModalVisible(false);
    }
  };

  // Close the modal without saving
  const cancelEdit = () => {
    setTask('');
    setIsEdit(false);
    setModalVisible(false);
  };

  // Animation function for scaling task list items
  const animateTask = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Render each task
  const renderTask = ({ item }) => (
    <Animated.View style={[styles.taskContainer, { transform: [{ scale: scaleValue }] }]}>
      <Text style={styles.taskText}>{item.task}</Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => editTask(item)}>
          <Icon name="pencil" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Icon name="trash" size={24} color="#E63946" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>To-Do CRUD List</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new task"
          placeholderTextColor="#9A9A9A"
          style={styles.input}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        {isEdit ? (
          <TouchableOpacity style={styles.addButton} onPress={updateTask}>
            <Icon name="checkmark-circle" size={40} color="#32CD32" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => { addTask(); animateTask(); }}>
            <Icon name="add-circle" size={40} color="#8A2BE2" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelEdit}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Task</Text>
          <TextInput
            placeholder="Update task"
            placeholderTextColor="#9A9A9A"
            style={styles.modalInput}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={updateTask}>
              <Icon name="checkmark-circle" size={40} color="#32CD32" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit}>
              <Icon name="close-circle" size={40} color="#E63946" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1C1C1C',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#8A2BE2',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 10,
    backgroundColor: '#2C2C2C',
    color: '#fff',
  },
  addButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
  },
  taskButtons: {
    flexDirection: 'row',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 35,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8A2BE2',
  },
  modalInput: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    borderRadius: 10,
    backgroundColor: '#2C2C2C',
    color: '#fff',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 150,
  },
});

export default App;
