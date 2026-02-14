import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import TextArea from '@/components/TextArea';
import Typo from '@/components/Typo';
import { HEADER_HEIGHT, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext'; // Import Hook
import api from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme(); // Dynamic Colors

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchContent(); }, [id]);

  const fetchContent = async () => {
    try {
      const res = await api.get(`/content/recall/${id}`);
      const data = res.data.content;
      setTitle(data.title || '');
      setLink(data.link || '');
      setDescription(data.description || '');
      if (data.tags && Array.isArray(data.tags)) setTags(data.tags.join(', '));
    } catch (e) {
      Alert.alert('Error', 'Could not fetch content details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');
      await api.put(`/content/recall/${id}`, { title, link, description, tags: tagArray.length > 0 ? tagArray : undefined });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Could not update item');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ScreenWrapper><Loading /></ScreenWrapper>;

  return (
    <ScreenWrapper>
      <Header title="Edit Brain Item" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView 
            contentContainerStyle={styles.container} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* Dynamic Card Background & No Shadow */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                
                <Typo size={14} color={colors.textLight} style={styles.label}>Title</Typo>
                <Input value={title} onChangeText={setTitle} containerStyle={styles.spacer} />

                <Typo size={14} color={colors.textLight} style={styles.label}>Link</Typo>
                <Input value={link} onChangeText={setLink} containerStyle={styles.spacer} />

                <Typo size={14} color={colors.textLight} style={styles.label}>Description</Typo>
                <TextArea value={description} onChangeText={setDescription} containerStyle={styles.spacer} />

                <Typo size={14} color={colors.textLight} style={styles.label}>Add New Tags</Typo>
                <Input placeholder="react, tech" value={tags} onChangeText={setTags} containerStyle={styles.spacer} />

                <Button onPress={handleUpdate} loading={saving} style={styles.button}>
                <Typo color={colors.white} fontWeight="bold">Update</Typo>
                </Button>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacingX._20, paddingTop: HEADER_HEIGHT + 20, paddingBottom: 50 },
  card: {
    borderRadius: radius._30,
    padding: spacingX._20,
    // REMOVED SHADOWS
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  label: { marginBottom: spacingY._5, marginLeft: 5, fontWeight: '600' },
  spacer: { marginBottom: spacingY._15 },
  button: { marginTop: spacingY._20 },
});