import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import TextArea from '@/components/TextArea';
import Typo from '@/components/Typo';
import { HEADER_HEIGHT, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext'; // Import Theme Hook
import api from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // 1. Get Dynamic Colors
  const { colors } = useTheme();

  const handleSave = async () => {
    if (!title && !link) return Alert.alert('Error', 'Please provide a title or link.');
    setLoading(true);
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      await api.post('/content', { title, link, description, tags: tagArray });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Could not save recall item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Add to Brain" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* 2. Apply Dynamic Background & Remove Shadows */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
              
              <Typo size={14} color={colors.textLight} style={styles.label}>Title</Typo>
              <Input placeholder="e.g. React Tutorial" value={title} onChangeText={setTitle} containerStyle={styles.spacer} />

              <Typo size={14} color={colors.textLight} style={styles.label}>Link (Optional)</Typo>
              <Input placeholder="https://..." value={link} onChangeText={setLink} containerStyle={styles.spacer} />

              <Typo size={14} color={colors.textLight} style={styles.label}>Description</Typo>
              <TextArea placeholder="Add some details..." value={description} onChangeText={setDescription} containerStyle={styles.spacer} />

              <Typo size={14} color={colors.textLight} style={styles.label}>Tags</Typo>
              <Input placeholder="tech, ideas, recipes" value={tags} onChangeText={setTags} containerStyle={styles.spacer} />

              <Button onPress={handleSave} loading={loading} style={styles.button}>
                  <Typo color={colors.white} fontWeight="bold">Save Memory</Typo>
              </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: spacingX._20, paddingTop: HEADER_HEIGHT + 20, paddingBottom: 50 },
  card: {
    borderRadius: radius._30,
    padding: spacingX._20,
    // REMOVED SHADOWS & ELEVATION completely
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Subtle border instead of shadow
  },
  label: { marginBottom: spacingY._5, marginLeft: 5, fontWeight: '600' },
  spacer: { marginBottom: spacingY._15 },
  button: { marginTop: spacingY._10 },
});