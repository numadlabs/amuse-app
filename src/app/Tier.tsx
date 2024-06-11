import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import TierCard from './components/atom/cards/TierCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tier = () => {
  const [visitCount, setVisitCount] = useState(0);
  const [userTier, setUserTier] = useState('Bronze');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedVisitCount = await AsyncStorage.getItem('visitCount');
        const savedTier = await AsyncStorage.getItem('userTier');

        if (savedVisitCount !== null) {
          const visitCountParsed = parseInt(savedVisitCount);
          console.log(`Loaded visit count: ${visitCountParsed}`);
          setVisitCount(visitCountParsed);
        }

        if (savedTier !== null) {
          console.log(`Loaded user tier: ${savedTier}`);
          setUserTier(savedTier);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const updateUserTier = async () => {
      let newTier = 'Bronze';
      if (visitCount >= 10) {
        newTier = 'Gold';
      } else if (visitCount >= 6) {
        newTier = 'Silver';
      }

      if (newTier !== userTier) {
        await AsyncStorage.setItem('userTier', newTier);
        setUserTier(newTier);
      }
    };

    updateUserTier();
  }, [visitCount]);

  const calculateProgress = (tier) => {
    const tiers = {
      Bronze: { start: 0, target: 3 },
      Silver: { start: 3, target: 6 },
      Gold: { start: 6, target: 10 },
    };
    const { start, target } = tiers[tier];

    return {
      current: visitCount - start > 0 ? visitCount - start : 0,
      target: target - start,
    };
  };

  const bronzeProgress = calculateProgress('Bronze');
  const silverProgress = calculateProgress('Silver');
  const goldProgress = calculateProgress('Gold');

  return (
    <>
      <Header title="Tier" />
      <View style={{ padding: 16, gap: 16, flex: 1 }}>
        <TierCard
          isActive={userTier === 'Bronze'}
          title='Bronze'
          perks={["10% more Bitcoin for every check-in", "Complimentary bites along the way"]}
          current={bronzeProgress.current}
          target={bronzeProgress.target}
        />
        <TierCard
          isActive={userTier === 'Silver'}
          title='Silver'
          perks={["20% more Bitcoin for every check-in", "Complimentary bites along the way"]}
          current={silverProgress.current}
          target={silverProgress.target}
        />
        <TierCard
          isActive={userTier === 'Gold'}
          title='Gold'
          perks={["30% more Bitcoin for every check-in", "Complimentary bites along the way"]}
          current={goldProgress.current}
          target={goldProgress.target}
        />
      </View>
    </>
  );
};

export default Tier;
