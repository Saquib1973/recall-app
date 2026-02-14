import ScreenWrapper from '@/components/ScreenWrapper';
import SkeletonCard from '@/components/SkeletonCard';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext'; // Import Theme Hook
import api from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getLinkPreview } from 'link-preview-js';
import { ArrowUpRight, MagnifyingGlass, PencilSimple, Play, Plus, Trash, UserCircle } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Linking, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

// --- HELPER: YouTube ID ---
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- COMPONENT: Smart Preview ---
const SmartPreview = ({ url }: { url: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const { theme } = useTheme(); // Get theme for conditional styling

  useEffect(() => {
    let isMounted = true;
    const fetchPreview = async () => {
      if (!url) return;
      const ytId = getYoutubeId(url);
      if (ytId) {
        if (isMounted) {
          setImageUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
          setIsVideo(true);
        }
        return;
      }
      if (url.includes('instagram.com/p/')) {
        const cleanUrl = url.split('?')[0].replace(/\/$/, ""); 
        if (isMounted) setImageUrl(`${cleanUrl}/media/?size=l`);
        return;
      }
      try {
        const data: any = await getLinkPreview(url);
        if (isMounted && data.images && data.images.length > 0) {
          setImageUrl(data.images[0]);
        }
      } catch (e) {
        console.log("No preview found for:", url);
      }
    };
    fetchPreview();
    return () => { isMounted = false; };
  }, [url]);

  if (!imageUrl) return null;

  return (
    <View style={[styles.previewContainer, { 
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
    }]}>
      <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
      {isVideo && (
        <View style={styles.playIconOverlay}>
          <View style={styles.playCircle}>
             <Play weight="fill" color={colors.black} size={20} style={{marginLeft: 2}} />
          </View>
        </View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colors: themeColors } = useTheme(); // Renamed to avoid clash

  const fetchRecalls = async () => {
    try {
      const res = await api.get('/content');
      setData(res.data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecalls();
    }, [])
  );

  // --- NEW: Confirmation Alert Logic ---
  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteItem(id)
        }
      ]
    );
  };

  const deleteItem = async (id: string) => {
    try {
      await api.delete('/content', { data: { contentId: id } });
      setData(prev => prev.filter((item: any) => item._id !== id));
    } catch (e) {
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  const HomeHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(app)/search')}>
          <MagnifyingGlass color={colors.white} size={28} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(app)/profile')}>
          <UserCircle color={colors.white} size={32} weight="fill" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerTitleRow}>
        <Typo size={32} fontWeight="bold" color={colors.white}>My Brain</Typo>
        <Typo size={16} color={colors.neutral200} style={{ marginTop: 5 }}>Your digital memory bank</Typo>
      </View>
    </View>
  );

  const getCardStyle = (index: number) => {
    const styles = [
      { bg: '#FDE047', text: colors.black, actionBtn: colors.black, actionIcon: colors.white, pillBg: 'rgba(0,0,0,0.08)', pillText: '#333' },
      { bg: themeColors.card, text: themeColors.text, actionBtn: themeColors.text, actionIcon: themeColors.background, pillBg: themeColors.inputBg, pillText: themeColors.text }, // Dynamic White/Dark Card
      { bg: '#bef264', text: colors.black, actionBtn: '#1a2e05', actionIcon: '#d9f99d', pillBg: 'rgba(26, 46, 5, 0.1)', pillText: '#1a2e05' },
      { bg: '#fecdd3', text: colors.black, actionBtn: '#881337', actionIcon: '#ffe4e6', pillBg: 'rgba(136, 19, 55, 0.1)', pillText: '#881337' },
    ];
    return styles[index % styles.length];
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const theme = getCardStyle(index);
    return (
      <View style={[styles.card, { backgroundColor: theme.bg }]}>
        <View style={styles.cardTop}>
          <View style={styles.textContainer}>
            <Typo fontWeight="700" size={20} color={theme.text} style={{ lineHeight: 28 }}>
              {item.title || 'Untitled Note'}
            </Typo>
            {item.description && (
              <Typo size={15} color={theme.text} style={{ marginTop: 8, opacity: 0.7 }}>
                {item.description}
              </Typo>
            )}
          </View>
          {item.link ? (
            <TouchableOpacity 
              style={[styles.bigActionButton, { backgroundColor: theme.actionBtn }]}
              onPress={() => Linking.openURL(item.link)}
            >
              <ArrowUpRight color={theme.actionIcon} size={24} weight="bold" />
            </TouchableOpacity>
          ) : <View style={{ width: 50 }} />}
        </View>

        {item.link && (
            <TouchableOpacity onPress={() => Linking.openURL(item.link)} activeOpacity={0.9}>
                <SmartPreview url={item.link} />
            </TouchableOpacity>
        )}

        <View style={styles.cardBottom}>
           <TouchableOpacity 
             style={[styles.pillButton, { backgroundColor: theme.pillBg }]}
             onPress={() => router.push(`/(app)/edit/${item._id}`)}
           >
              <PencilSimple size={16} weight="bold" color={theme.pillText} />
              <Typo size={13} fontWeight="600" color={theme.pillText} style={{ marginLeft: 6 }}>Edit</Typo>
           </TouchableOpacity>

           <TouchableOpacity 
             style={[styles.pillButton, { backgroundColor: theme.pillBg }]}
             onPress={() => confirmDelete(item._id)} // CHANGED: Calls confirmDelete now
           >
              <Trash size={16} weight="bold" color={theme.pillText} />
              <Typo size={13} fontWeight="600" color={theme.pillText} style={{ marginLeft: 6 }}>Delete</Typo>
           </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ paddingTop: 0 }}>
      
      {loading ? (
        <FlatList
          data={[1,2,3,4,5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
               refreshing={loading} 
               onRefresh={fetchRecalls} 
               tintColor={colors.primary} 
               progressViewOffset={260} 
            />
          }
          ListEmptyComponent={
            <Typo style={{ textAlign: 'center', marginTop: 40 }} color={colors.neutral400}>No memories found.</Typo>
          }
        />
      )}

      <HomeHeader />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/create')}>
        <Plus color={colors.white} size={30} weight="bold" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#E64A19',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: spacingY._25,
    paddingHorizontal: spacingX._20,
    borderBottomLeftRadius: radius._40,
    borderBottomRightRadius: radius._40,
    zIndex: 10,
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacingY._20 },
  headerTitleRow: { paddingBottom: 10 },
  iconButton: { padding: 5 },
  list: { 
      paddingHorizontal: spacingX._5, 
      paddingTop: 250, 
      flexGrow: 1, 
      gap: spacingY._5, 
      paddingBottom: 100 
  },
  card: {
    borderRadius: radius._50,
    padding: 22,
    // Removed shadows for cleaner UI (matching your request)
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, paddingRight: 15 },
  bigActionButton: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  previewContainer: {
    marginTop: 20, width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', borderWidth: 1
  },
  previewImage: { width: '100%', height: '100%' },
  playIconOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)'
  },
  playCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5
  },
  cardBottom: { flexDirection: 'row', marginTop: 20, gap: 10 },
  pillButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#111', width: 65, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 10,
  },
});