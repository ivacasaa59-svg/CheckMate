import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import DatePickerField from '../components/DatePickerField';
import { scheduleTaskNotification } from '../utils/notifications';

const formatSaveDate = (date) => {
  const dayPart = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dayPart} · ${timePart}`;
};

const PRIORITIES = [
  { key: 'alta',  label: 'Alta',  icon: 'flame',        color: '#FF5E7A', bg: '#FF5E7A18', border: '#FF5E7A55' },
  { key: 'media', label: 'Media', icon: 'alert-circle', color: '#FFC844', bg: '#FFC84418', border: '#FFC84455' },
  { key: 'baja',  label: 'Baja',  icon: 'leaf',         color: '#4ECDF5', bg: '#4ECDF518', border: '#4ECDF555' },
];

export default function AddTaskScreen({ navigation }) {
  const { addTask } = useTasks();
  const { theme, isDark } = useTheme();

  // Chatbot state
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('title'); // title -> desc -> priority -> datetime -> done
  const [inputText, setInputText] = useState('');
  
  // Data recolectada
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'media',
    date: new Date(),
  });

  const flatListRef = useRef(null);

  useEffect(() => {
    // Saludo inicial
    addBotMessage('¡Hola! ¿Qué tienes planeado hacer hoy?');
  }, []);

  const addBotMessage = (text, type = 'text', delay = 600) => {
    // Simular escritura del bot
    const id = Date.now().toString() + Math.random();
    setMessages(prev => [...prev, { id: 'typing', sender: 'bot', type: 'typing' }]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      setMessages(prev => [...prev, { id, sender: 'bot', text, type }]);
      scrollToBottom();
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text, type: 'text' }]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendText = () => {
    const txt = inputText.trim();
    if (!txt && step !== 'desc') return;

    if (step === 'title') {
      addUserMessage(txt);
      setTaskData(prev => ({ ...prev, title: txt }));
      setInputText('');
      setStep('desc');
      addBotMessage('Genial. ¿Quieres agregar algún detalle o nota extra? (Si no, simplemente presiona Omitir)');
    } else if (step === 'desc') {
      if (txt) addUserMessage(txt);
      else addUserMessage('Sin detalles extra.');
      setTaskData(prev => ({ ...prev, description: txt }));
      setInputText('');
      setStep('priority');
      addBotMessage('¿Qué nivel de prioridad tiene esta tarea?', 'priority');
    }
  };

  const handlePrioritySelect = (pKey, pLabel) => {
    if (step !== 'priority') return; // Evitar multi-clicks accidentales
    addUserMessage(`Prioridad ${pLabel}`);
    setTaskData(prev => ({ ...prev, priority: pKey }));
    setStep('datetime');
    addBotMessage('Por último, ¿para cuándo la programamos?', 'datetime');
  };

  const handleDateTimeConfirm = async (selectedDate) => {
    if (step !== 'datetime') return;
    setTaskData(prev => ({ ...prev, date: selectedDate }));
    
    const formattedDate = formatSaveDate(selectedDate);
    addUserMessage(`Para el ${formattedDate}`);
    
    setStep('done');
    addBotMessage('¡Listo! He guardado tu tarea. Configurando la notificación...', 'text', 400);

    // Guardar la tarea y notificar
    setTimeout(async () => {
      addTask({ 
        title: taskData.title, 
        description: taskData.description, 
        priority: taskData.priority, 
        date: formattedDate 
      });
      
      // Programar la notificación push local
      await scheduleTaskNotification(
        taskData.title,
        taskData.description || '¡Es hora de completar tu tarea!',
        selectedDate
      );

      navigation.goBack();
    }, 1500);
  };

  // Renderers
  const s = makeStyles(theme);

  const renderMessage = ({ item }) => {
    if (item.type === 'typing') {
      return (
        <View style={[s.msgBubble, s.botMsg]}>
          <Text style={s.typingText}>Escribiendo...</Text>
        </View>
      );
    }

    const isBot = item.sender === 'bot';
    
    return (
      <View style={[s.msgWrapper, isBot ? s.msgWrapperBot : s.msgWrapperUser]}>
        {isBot && (
          <LinearGradient colors={theme.accentGradient} style={s.avatarSmall}>
            <Ionicons name="hardware-chip" size={16} color="#fff" />
          </LinearGradient>
        )}
        
        <View style={[s.msgBubble, isBot ? s.botMsg : s.userMsg]}>
          {item.text && <Text style={[s.msgText, isBot ? s.botText : s.userText]}>{item.text}</Text>}
          
          {/* Opciones interactivas del Bot */}
          {isBot && item.type === 'priority' && step === 'priority' && (
            <View style={s.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.key}
                  onPress={() => handlePrioritySelect(p.key, p.label)}
                  style={[s.priorityChip, { backgroundColor: p.bg, borderColor: p.border }]}
                >
                  <Ionicons name={p.icon} size={13} color={p.color} />
                  <Text style={[s.priorityChipText, { color: p.color }]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {isBot && item.type === 'datetime' && step === 'datetime' && (
            <View style={s.datePickerWrapper}>
              <DatePickerField 
                value={taskData.date} 
                onChange={(d) => setTaskData(prev => ({ ...prev, date: d }))} 
              />
              <TouchableOpacity 
                style={s.confirmDateBtn} 
                onPress={() => handleDateTimeConfirm(taskData.date)}
              >
                <Text style={s.confirmDateBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const isInputDisabled = step !== 'title' && step !== 'desc';

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle={isDark ? "light-content" : "light-content"} backgroundColor={isDark ? '#0F0F18' : theme.accent} />

      {/* ── Header ── */}
      <LinearGradient colors={theme.headerGradient} style={s.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.backButton, pressed && s.backButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={s.headerTitle}>Asistente Guardián</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* ── Chat Flow ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.chatList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {/* ── Input Area ── */}
      <View style={s.inputContainer}>
        <View style={[s.inputWrapper, isInputDisabled && s.inputWrapperDisabled]}>
          <TextInput
            style={s.input}
            placeholder={
              step === 'title' ? "Escribe la tarea..." 
              : step === 'desc' ? "Escribe detalles (o dale a Omitir)..." 
              : "Espera a la siguiente opción..."
            }
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            editable={!isInputDisabled}
            onSubmitEditing={handleSendText}
            returnKeyType={step === 'title' ? "send" : "default"}
          />
          {step === 'desc' && !inputText.trim() ? (
            <TouchableOpacity onPress={handleSendText} style={s.skipBtn}>
              <Text style={s.skipBtnText}>Omitir</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={handleSendText} 
              disabled={isInputDisabled || (!inputText.trim() && step === 'title')}
              style={[s.sendBtn, (isInputDisabled || (!inputText.trim() && step === 'title')) && s.sendBtnDisabled]}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, paddingBottom: 18 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    backButtonPressed: { backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
    
    chatList: { padding: 16, paddingBottom: 30, gap: 12 },
    msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
    msgWrapperBot: { justifyContent: 'flex-start' },
    msgWrapperUser: { justifyContent: 'flex-end' },
    
    avatarSmall: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 4 },
    
    msgBubble: { maxWidth: '85%', padding: 14, borderRadius: 20 },
    botMsg: { backgroundColor: t.bgCard, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: t.border },
    userMsg: { backgroundColor: t.accent, borderBottomRightRadius: 4 },
    
    msgText: { fontSize: 15, lineHeight: 22 },
    botText: { color: t.textPrimary },
    userText: { color: '#ffffff' },
    typingText: { color: t.textMuted, fontStyle: 'italic' },

    priorityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    priorityChip: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
    priorityChipText: { fontSize: 12, fontWeight: '700' },

    datePickerWrapper: { marginTop: 12, gap: 10 },
    confirmDateBtn: { backgroundColor: t.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    confirmDateBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    inputContainer: { padding: 16, backgroundColor: t.bgCard, borderTopWidth: 1, borderTopColor: t.border },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: 24, borderWidth: 1, borderColor: t.border, paddingLeft: 16, paddingRight: 6 },
    inputWrapperDisabled: { opacity: 0.6, backgroundColor: t.bg },
    input: { flex: 1, height: 50, fontSize: 15, color: t.textPrimary },
    sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: t.accent, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    sendBtnDisabled: { backgroundColor: t.textMuted },
    skipBtn: { paddingHorizontal: 14, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    skipBtnText: { color: t.accent, fontWeight: '600', fontSize: 14 },
  });
