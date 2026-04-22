import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Basic validation, bypass for demo
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <LinearGradient
        colors={theme.headerGradient}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Decorative elements */}
      <View style={[styles.circle1, { backgroundColor: theme.accentSoft }]} />
      <View style={[styles.circle2, { backgroundColor: theme.cyanSoft }]} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Log in to continue to CheckMate</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Email"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.accent }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} style={{ marginTop: 20 }}>
            <LinearGradient
              colors={theme.accentGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={{ color: theme.textSecondary }}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={[styles.registerText, { color: theme.accent }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    left: -100,
    opacity: 0.8,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: -50,
    right: -50,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    zIndex: 1,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C6EFA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    fontWeight: 'bold',
    fontSize: 14,
  }
});
