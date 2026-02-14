import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useRouter } from 'expo-router';
import { LockKey, User } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) return Alert.alert('Error', 'Please fill all fields');
        setLoading(true);
        try {
            const res = await api.post('/user/signin', { username, password });
            await signIn(res.data.token);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
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
                        <Typo size={40} fontWeight="800" color={colors.primary} style={{ marginBottom: 10 }}>Recall</Typo>
                        <Typo size={16} color={colors.neutral400} style={{ textAlign: 'center' }}>Welcome back to your second brain.</Typo>
                    </View>

                    <View style={styles.form}>
                        <Input
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            icon={<User size={20} color={colors.neutral500} weight="fill" />}
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<LockKey size={20} color={colors.neutral500} weight="fill" />}
                        />
                        
                        <Typo size={14} color={colors.neutral500} fontWeight="600" style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
                            Forgot Password?
                        </Typo>

                        <Button onPress={handleLogin} loading={loading} style={styles.button}>
                            <Typo color={colors.white} fontWeight="bold" size={16}>Login</Typo>
                        </Button>
                    </View>

                    <View style={styles.footer}>
                        <Typo size={15} color={colors.neutral400}>Don&apos;t have an account? </Typo>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Typo size={15} color={colors.primary} fontWeight="bold">Sign Up</Typo>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacingX._20, paddingBottom: 50 },
    header: { alignItems: 'center', marginBottom: spacingY._40 },
    form: { gap: spacingY._15 },
    button: { marginTop: 10 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacingY._30 },
});