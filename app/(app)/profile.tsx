// app/(app)/profile.tsx
import Button from '@/components/Button';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme'; // Don't import colors here
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext'; // Import Hook
import api from '@/services/api';
import { Desktop, Moon, SignOut, Sun } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { setMode, mode, colors } = useTheme(); // Get theme controls
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => { fetchShareStatus(); }, []);

  const fetchShareStatus = async () => {
    try {
      const res = await api.get('/content/share');
      if (res.data.link) setShareLink(res.data.link.hash);
    } catch (e) {}
  };

  const toggleShareLink = async () => {
    try {
      if (shareLink) {
        await api.post('/content/share', { share: false });
        setShareLink(null);
      } else {
        const res = await api.post('/content/share', { share: true });
        setShareLink(res.data.link.hash);
      }
    } catch (e) { Alert.alert('Error', 'Could not update link'); }
  };

  const ThemeOption = ({ option, icon, label }: any) => {
    const isActive = mode === option;
    return (
      <TouchableOpacity 
        onPress={() => setMode(option)}
        style={[
          styles.themeBtn, 
          { 
            backgroundColor: isActive ? colors.primary : colors.inputBg,
            borderColor: isActive ? colors.primary : colors.inputBorder
          }
        ]}
      >
        {icon(isActive ? colors.white : colors.textLight)}
        <Typo size={12} fontWeight="600" color={isActive ? colors.white : colors.textLight} style={{marginTop: 5}}>
          {label}
        </Typo>
      </TouchableOpacity>
    )
  }

  return (
    <ScreenWrapper>
      <Header title="Settings" />
      
      <View style={styles.container}>
        
        {/* Appearance Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Typo fontWeight="bold" size={18} color={colors.textLight} style={styles.sectionTitle}>
            Appearance
          </Typo>
          <View style={styles.themeRow}>
            <ThemeOption 
              option="light" 
              label="Light" 
              icon={(c: string) => <Sun weight="bold" color={c} size={24} />} 
            />
            <ThemeOption 
              option="dark" 
              label="Dark" 
              icon={(c: string) => <Moon weight="bold" color={c} size={24} />} 
            />
            <ThemeOption 
              option="system" 
              label="System" 
              icon={(c: string) => <Desktop weight="bold" color={c} size={24} />} 
            />
          </View>
        </View>

        {/* Public Link Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Typo fontWeight="bold" size={18} color={colors.textLight} style={styles.sectionTitle}>
            Public Brain Link
          </Typo>
          <Typo size={14} color={colors.textLight} style={{ marginBottom: 15 }}>
            {shareLink ? `Your brain is public!` : 'Your brain is currently private.'}
          </Typo>
          <Button 
            onPress={toggleShareLink} 
            style={{ backgroundColor: shareLink ? colors.rose : colors.primary, borderRadius: radius._15 }}
          >
            <Typo color={colors.white} fontWeight="bold">
              {shareLink ? 'Disable Public Link' : 'Generate Public Link'}
            </Typo>
          </Button>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <SignOut color={colors.rose} size={24} weight="bold" />
          <Typo color={colors.rose} fontWeight="bold" style={{ marginLeft: 10 }}>Log Out</Typo>
        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacingX._20, paddingTop: 140 },
  card: { 
    padding: spacingX._20, 
    borderRadius: radius._30, 
    marginBottom: spacingY._20, 
  },
  sectionTitle: { marginBottom: spacingY._15 },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: spacingY._15, 
    marginTop: 10 
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: radius._20,
    borderWidth: 1,
  }
});