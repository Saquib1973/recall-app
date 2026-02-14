import Header from '@/components/Header';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, HEADER_HEIGHT_EXPANDED, radius, spacingX, spacingY } from '@/constants/theme';
import api from '@/services/api';
import { ArrowUpRight, MagnifyingGlass, Trash } from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Create a ref for the input
  const inputRef = useRef<TextInput>(null);

  // 2. Focus the input when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // 100ms delay ensures smooth transition
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/content/search?q=${query}`);
      setResults(res.data.results);
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    // Optional: Focus again after clearing
    inputRef.current?.focus();
  };

  const getCardStyle = (index: number) => {
    const styles = [
      { bg: '#FDE047', text: colors.black, actionBtn: colors.black, actionIcon: colors.white },
      { bg: colors.white, text: colors.black, actionBtn: colors.black, actionIcon: colors.white },
      { bg: '#bef264', text: colors.black, actionBtn: '#1a2e05', actionIcon: '#d9f99d' },
      { bg: '#fecdd3', text: colors.black, actionBtn: '#881337', actionIcon: '#ffe4e6' },
    ];
    return styles[index % styles.length];
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const theme = getCardStyle(index);
    return (
      <View style={[styles.card, { backgroundColor: theme.bg }]}>
        <View style={styles.cardTop}>
          <View style={styles.textContainer}>
            <Typo fontWeight="700" size={20} color={theme.text} style={{ lineHeight: 28 }}>{item.title}</Typo>
            {item.description && (
              <Typo size={15} color={theme.text} style={{ marginTop: 8, opacity: 0.7 }}>{item.description}</Typo>
            )}
          </View>
          {item.link ? (
            <TouchableOpacity style={[styles.bigActionButton, { backgroundColor: theme.actionBtn }]} onPress={() => Linking.openURL(item.link)}>
              <ArrowUpRight color={theme.actionIcon} size={24} weight="bold" />
            </TouchableOpacity>
          ) : <View style={{ width: 50 }} />}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ paddingTop: 0 }}>
      <Header title="Search Brain">
        <View style={styles.searchContainer}>
          <Input 
            // 3. Attach the ref here
            inputRef={inputRef}
            placeholder="Search..." 
            value={query} 
            onChangeText={setQuery} 
            // OVERRIDE: White input on orange header
            containerStyle={styles.searchInput} 
            inputStyle={{ color: colors.text }} 
            placeholderTextColor={colors.neutral400}
            onSubmitEditing={handleSearch}
            icon={query.length > 0 ? (
                <TouchableOpacity onPress={clearSearch}>
                   <Trash size={20} color={colors.neutral400} weight="fill" />
                </TouchableOpacity>
              ) : undefined}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.headerSearchBtn}>
             <MagnifyingGlass color={colors.primary} size={22} weight="bold" />
          </TouchableOpacity>
        </View>
      </Header>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: HEADER_HEIGHT_EXPANDED + 50 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Typo style={{ textAlign: 'center', marginTop: 100 }} color={colors.neutral400}>{query ? 'No results found.' : 'Type to search your brain.'}</Typo>}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacingX._5, paddingTop: HEADER_HEIGHT_EXPANDED + 30, flexGrow: 1, gap: spacingY._5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { 
    flex: 1, 
    height: 52, 
    backgroundColor: colors.white, 
    borderColor: colors.white,
    paddingHorizontal: 12
  },
  headerSearchBtn: { backgroundColor: colors.white, height: 52, width: 52, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: radius._50, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, paddingRight: 15 },
  bigActionButton: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
});