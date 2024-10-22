// app/Menu/[id].tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Color from '@/constants/Color';
import { BODY_1_BOLD, BODY_2_MEDIUM, CAPTION_1_REGULAR } from '@/constants/typography';

interface MenuModalParams extends Record<string, string> {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export default function MenuModal() {
  const params = useLocalSearchParams<MenuModalParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          presentation: 'modal',
          headerStyle: {
            backgroundColor: Color.Gray.gray500,
          },
          headerTintColor: Color.base.White,
          headerTitle: params.name || 'Menu Item',
        }} 
      />
      
      <View style={styles.content}>
        {params.category && <Text style={styles.category}>{params.category}</Text>}
        {params.name && <Text style={styles.name}>{params.name}</Text>}
        {params.price && <Text style={styles.price}>{params.price}</Text>}
        {params.description && <Text style={styles.description}>{params.description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray500,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  category: {
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray50,
  },
  name: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
  price: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
  },
  description: {
    ...BODY_2_MEDIUM,
    color: Color.Gray.gray50,
  },
});