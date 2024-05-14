import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Color from './constants/Color';
import { useQuery } from '@tanstack/react-query';
import { restaurantKeys } from './lib/service/keysHelper';
import { getPurchaseablePerks } from './lib/service/queryHelper';
import useLocationStore from './lib/store/userLocation';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PerkGradient from './components/icons/PerkGradient';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

const PerkMarket = () => {
  const { id } = useLocalSearchParams();
  const { currentLocation } = useLocationStore();
  const { data: perks = [], isLoading, isError } = useQuery({
    queryKey: restaurantKeys.all,
    queryFn: () => {
      return getPurchaseablePerks(id);
    },
    enabled: !!currentLocation,
  });

  return (

    <GestureHandlerRootView style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error fetching data</Text>
      ) : (
        <FlatList
          style={{ width: '100%' }}
          data={perks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.content}
            >

              <PerkGradient />
              <Text style={styles.perkName}>{item.name}</Text>
              <Text style={styles.perkPrice}>{`Buy ${item.price}`}</Text>

            </LinearGradient>
          )}
          numColumns={2}
        />
      )}
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Color.Gray.gray600,
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    margin:15
  },
  perkItem: {

    borderRadius: 10,
    padding: 20,
   
    width: '48%', // Adjust as needed
    alignItems: 'center',
  },
  perkName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  perkPrice: {
    fontSize: 16,
    color: Color.base.White,
    marginTop: 5,
  },
});

export default PerkMarket;
