import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import Color from "@/constants/Color";
import Header from "@/components/layout/Header";
import Balance from "@/components/sections/Balance";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import {
  getUserById,
  getUserTaps,
  getUserTransaction,
} from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import Close from "@/components/icons/Close";
import Button from "@/components/ui/Button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { height, width } from "@/lib/utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CardSend } from "iconsax-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionCard from "@/components/atom/cards/TransactionCard";
import { BODY_2_REGULAR, BUTTON_40, H6 } from "@/constants/typography";

const Wallet = () => {
  const { authState } = useAuth();
  const pressed = useSharedValue(false);
  const [isOpenBalance, setIsOpenBalance] = useState<boolean>(false);

  const { data: user } = useQuery({
    queryKey: userKeys.info,
    queryFn: () => {
      return getUserById(authState.userId);
    },
    enabled: !!authState.userId,
  });

  const { data: transaction = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => {
      return getUserTransaction(authState.userId);
    },
  });

  const reversedTransactions = useMemo(() => {
    return [...transaction].reverse();
  }, [transaction]);

  const toggleBalanceBottomSheet = () => {
    setIsOpenBalance(!isOpenBalance);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Gray.gray600 }}>
      <GestureHandlerRootView>
        <Header title="Wallet" />
        <View style={styles.body}>
          <Balance
            amount={user?.user?.balance}
            convertedAmount={user?.convertedBalance}
            currencyName="EUR"
            handleToggle={() => toggleBalanceBottomSheet()}
          />

          {/* <View style={styles.button}>
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center", gap: 4 }}
            >
              <CardSend size={24} color={Color.Gray.gray100} />
              <Text
                style={{
                  color: Color.Gray.gray100,
                  ...BUTTON_40,
                }}
              >
                Withdraw
              </Text>
            </TouchableOpacity>
          </View> */}

          <View>
            <Text
              style={{
                ...H6,
                color: Color.base.White,
                marginHorizontal: 16,
              }}
            >
              Transaction history
            </Text>

            {isLoading ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : reversedTransactions.length > 0 ? (
              <FlatList
                style={{ marginTop: 16 }}
                data={reversedTransactions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TransactionCard
                    amount={item?.amount}
                    type={item?.type}
                    createdAt={item?.createdAt}
                  />
                )}
              />
            ) : (
              <Text
                style={{
                  color: Color.Gray.gray100,
                  marginHorizontal: 16,
                  marginTop: 16,
                }}
              >
                No transactions found
              </Text>
            )}
          </View>
        </View>

        {/* Tooltip */}
        {isOpenBalance && (
          <Modal transparent={true}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={toggleBalanceBottomSheet}
            >
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  {
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 98,
                  },
                  animatedStyles,
                ]}
              />
              <Animated.View
                entering={SlideInDown.springify().damping(18)}
                exiting={SlideOutDown.springify()}
                style={[
                  {
                    backgroundColor: Color.Gray.gray600,
                    height: height / 2.38,
                    bottom: 0,
                    width: width,
                    zIndex: 99,
                    position: "absolute",
                    borderTopStartRadius: 32,
                    borderTopEndRadius: 32,
                    gap: 24,
                    padding: 16,
                    alignItems: "center",
                  },
                  animatedStyles,
                ]}
              >
                <View
                  style={{
                    paddingVertical: 8,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      ...H6,
                      color: Color.base.White,
                    }}
                  >
                    About your Balance
                  </Text>
                  <TouchableOpacity onPress={toggleBalanceBottomSheet}>
                    <View
                      style={{
                        backgroundColor: Color.Gray.gray400,
                        borderRadius: 48,
                        padding: 8,
                        width: 32,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: 1,
                        position: "absolute",
                        left: 55,
                        top: -18,
                      }}
                    >
                      <Close />
                    </View>
                  </TouchableOpacity>
                </View>
                <Image
                  source={require("@/public/images/balanceInfo.png")}
                  style={{ height: 64, width: 204 }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    ...BODY_2_REGULAR,
                    color: Color.Gray.gray50,
                  }}
                >
                  You earned ALYS Bitcoin, which is faster and cheaper to use
                  but still pegged 1:1 with mainchain Bitcoin. Use your balance
                  to redeem perks at restaurants. Withdrawals to external crypto
                  wallets coming soon.
                </Text>
                <Button
                  variant="primary"
                  textStyle="primary"
                  onPress={toggleBalanceBottomSheet}
                  style={{ width: "100%" }}
                >
                  <Text>Got it</Text>
                </Button>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
    flexDirection: "column",
    gap: 16,
  },
  button: {
    width: 80,
    height: 80,
    marginTop: 16,
    marginHorizontal: 16,
  },
});
