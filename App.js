import React, { useState, useEffect } from 'react';
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
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';

const App = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText.trim()) {
      Animated.spring(scaleValue, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    }
  }, [searchText]);

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; 

  const addTask = () => {
    if (task.trim()) {
      const newTask = { id: Date.now().toString(), task };
      const updatedTaskList = [...taskList, newTask];
      setTaskList(updatedTaskList);
      setFilteredTaskList(updatedTaskList);
      setTask('');
      Alert.alert('Success', 'Task added successfully!', [{ text: 'OK' }]);
    } else {
      Alert.alert('Error', 'Please enter a task before adding.', [{ text: 'OK' }]);
    }
  };

  const deleteTask = (id) => {
    const updatedTaskList = taskList.filter((item) => item.id !== id);
    setTaskList(updatedTaskList);
    setFilteredTaskList(updatedTaskList);
    Alert.alert('Deleted', 'Task has been removed.', [{ text: 'OK' }]);
  };

  const editTask = (item) => {
    setIsEdit(true);
    setTaskToEdit(item);
    setTask(item.task);
    setModalVisible(true);
  };

  const updateTask = () => {
    if (task.trim()) {
      const updatedTasks = taskList.map((item) =>
        item.id === taskToEdit.id ? { ...item, task } : item
      );
      setTaskList(updatedTasks);
      setFilteredTaskList(updatedTasks);
      setTask('');
      setIsEdit(false);
      setModalVisible(false);
      Alert.alert('Success', 'Task updated successfully!', [{ text: 'OK' }]);
    } else {
      Alert.alert('Error', 'Task cannot be empty.', [{ text: 'OK' }]);
    }
  };

  const cancelEdit = () => {
    setTask('');
    setIsEdit(false);
    setModalVisible(false);
  };

  const animateTask = () => {
    Animated.timing(scaleValue, {
      toValue: 1.05,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const searchTask = (text) => {
    setSearchText(text);
    if (text.trim()) {
      const filteredTasks = taskList.filter((item) =>
        item.task.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTaskList(filteredTasks);
    } else {
      setFilteredTaskList(taskList);
    }
  };

  const renderTask = ({ item }) => (
    <Animated.View style={[styles.taskContainer, { transform: [{ scale: scaleValue }] }]}>
      <View style={styles.taskContent}>
        <Text style={styles.taskText}>{item.task}</Text>
        <View style={styles.taskButtons}>
          <TouchableOpacity onPress={() => editTask(item)} style={styles.iconButton}>
            <Icon name="pencil" size={24} color="#1E90FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.iconButton}>
            <Icon name="trash" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={cancelEdit}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalView, { opacity: scaleValue }]}>
          <Text style={styles.modalText}>Edit Task</Text>
          <TextInput
            placeholder="Update task"
            placeholderTextColor="#1E90FF"
            style={styles.modalInput}
            value={task}
            onChangeText={(text) => setTask(text)}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={updateTask} style={styles.modalButton}>
              <Icon name="checkmark-circle" size={40} color="#32CD32" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit} style={styles.modalButton}>
              <Icon name="close-circle" size={40} color="#FF6347" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Sticky Notes</Text>

      {/* Search Bar */}
      <View style={styles.inputContainer}>
        <Icon name="search" size={24} color="#1E90FF" style={styles.icon} />
        <TextInput
          placeholder="Search tasks"
          placeholderTextColor="#1E90FF"
          style={styles.input}
          value={searchText}
          onChangeText={(text) => searchTask(text)}
        />
      </View>

      {/* Input and Add/Edit Button */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new task"
          placeholderTextColor="#1E90FF"
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
            <Icon name="add-circle" size={40} color="#1E90FF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Task List */}
      {filteredTaskList.length > 0 ? (
        <FlatList
          data={filteredTaskList}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.noTaskContainer}>
          <Text style={styles.noTaskText}>No tasks found</Text>
        </View>
      )}

      {/* Edit Modal */}
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E6F0FF', 
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E90FF',
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: '#BCC6DA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BCC6DA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    marginRight: 12,
  },
  addButton: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  taskContainer: {
    width: Dimensions.get('window').width / 2.2,
    marginVertical: 10,
    padding: 14,
    backgroundColor: '##1E90FF',
    borderRadius: 8,
    elevation: 5, 
    shadowColor: '#BCC6DA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ rotate: '1deg' }], 
    alignItems: 'center',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#1E90FF', 
    fontFamily: 'Poppins-Regular',
    lineHeight: 22, 
    textAlign: 'center',
  },
  taskButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  noTaskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTaskText: {
    fontSize: 18,
    color: '#1E90FF', 
    fontFamily: 'Poppins-Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#BCC6DA',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderColor: '#1E90FF',
    borderWidth: 1,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});

export default App;
