import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import api from '@/services/api';
import { useRouter } from 'expo-router';
import { LockKey, User } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !password) return Alert.alert('Hold up', 'Please fill in both fields.');
    if (password.length < 5) return Alert.alert('Invalid Password', 'Password must be at least 5 characters long.');
    
    setLoading(true);
    try {
      await api.post('/user/signup', { username, password });
      Alert.alert('Success', 'Account created! Please log in.', [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
            contentContainerStyle={styles.container} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Typo size={32} fontWeight="800" color={colors.white} style={{ marginBottom: 10 }}>Create Account</Typo>
                <Typo size={16} color={colors.neutral400}>Join Recall and start saving memories.</Typo>
            </View>

            <View style={styles.form}>
                <Input 
                    placeholder="Choose a Username" 
                    value={username} 
                    onChangeText={setUsername} 
                    icon={<User size={20} color={colors.neutral500} weight="fill" />}
                    autoCapitalize="none"
                />
                <Input 
                    placeholder="Create a Password (min 5 chars)" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry
                    icon={<LockKey size={20} color={colors.neutral500} weight="fill" />}
                />
                <Button onPress={handleRegister} loading={loading} style={styles.button}>
                    <Typo color={colors.white} fontWeight="bold" size={16}>Sign Up</Typo>
                </Button>
            </View>

            <View style={styles.footer}>
                <Typo size={15} color={colors.neutral400}>Already have an account? </Typo>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Typo size={15} color={colors.primary} fontWeight="bold">Login</Typo>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacingX._20, paddingBottom: 50 },
  header: { marginBottom: spacingY._30 },
  form: { gap: spacingY._15 },
  button: { marginTop: spacingY._10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacingY._30 }
});