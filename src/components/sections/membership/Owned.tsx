import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Color from "@/constants/Color";
import { LinearGradient } from "expo-linear-gradient";
import PerkGradient from "../../icons/PerkGradient";
import { router } from "expo-router";
import PowerUpCard from "../../atom/cards/PowerUpCard";
import DetailsSheet from "../DetailsSheet";
import { Add, InfoCircle, TicketStar } from "iconsax-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { RestaurantType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getPerksByRestaurant } from "@/lib/service/queryHelper";
import { restaurantKeys } from "@/lib/service/keysHelper";
import useLocationStore from "@/lib/store/userLocation";
import {
  BODY_1_BOLD,
  BODY_2_MEDIUM,
  BUTTON_40,
  BUTTON_48,
  CAPTION_1_REGULAR,
} from "@/constants/typography";
import MenuCard from "@/components/atom/cards/MenuCard";
import { useMenuStore } from "@/lib/store/menuStore";
import CartSummary from "./CartSummary";
import { height } from "@/lib/utils";

interface OwnedProps {
  userCardId: [];
  followingPerk: [];
  data: RestaurantType;
  cardId: string;
  isLoading: boolean;
  isOpen: boolean;
  onPress: () => void;
  marker: RestaurantType;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: any;
}

const menuImages = {
  salmon: require("../../../public/images/salmon.jpg"),
  steak: require("../../../public/images/steak.jpg"),
  salad: require("../../../public/images/salad.jpg"),
  bruschetta: require("../../../public/images/bruschetta.jpg"),
};

const mockMenuData = {
  categories: [
    {
      name: "Main Course",
      items: [
        {
          id: "1",
          name: "Grilled Salmon",
          description: "Fresh salmon with herbs and lemon",
          price: "$24.99",
          category: "Main Course",
          image: menuImages.salmon,
        },
        {
          id: "2",
          name: "Steak Frites",
          description: "Prime beef with truffle fries",
          price: "$29.99",
          category: "Main Course",
          image: menuImages.steak,
        },
      ],
    },
    {
      name: "Appetizers",
      items: [
        {
          id: "3",
          name: "Caesar Salad",
          description: "Classic caesar with parmesan",
          price: "$12.99",
          category: "Appetizers",
          image: menuImages.salad,
        },
        {
          id: "4",
          name: "Bruschetta",
          description: "Toasted bread with tomatoes and basil",
          price: "$9.99",
          category: "Appetizers",
          image: menuImages.bruschetta,
        },
      ],
    },
  ],
};

const Owned: React.FC<OwnedProps> = ({ data, isLoading, onPress }) => {
  const [showPerks, setShowPerks] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const currentLocation = useLocationStore();
  const { addItem, removeItem, getTotalQuantity } = useMenuStore();
  const [activeTab, setActiveTab] = useState<"perks" | "menu" | "details">(
    "perks",
  );

  const { data: perks = [] } = useQuery({
    queryKey: restaurantKeys.perks(data?.id as string),
    queryFn: () => getPerksByRestaurant(data.id),
    enabled: !!currentLocation,
  });

  const hasPerks =
    perks && (perks.userBonuses?.length > 0 || perks.followingBonus);

  const handleNavigation = () => {
    router.push({
      pathname: "/PerkMarket",
      params: {
        id: data.id,
      },
    });
  };

  const notOwnedNavigation = () => {
    router.push({
      pathname: "/FollowingPerk",
      params: {
        current: perks?.followingBonus?.current,
        target: perks?.followingBonus?.target,
        name: perks?.followingBonus?.name,
      },
    });
  };

  const renderPerks = () => (
    <View style={styles.powerUpGrid}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perks</Text>
        <TouchableOpacity onPress={onPress}>
          <InfoCircle size={20} color={Color.Gray.gray50} />
        </TouchableOpacity>
      </View>
      {hasPerks ? (
        <>
          {perks?.userBonuses?.map((item, index) => (
            <PowerUpCard
              key={index}
              title={item.name}
              onPress={() =>
                router.push({
                  pathname: `/PowerUp`,
                  params: {
                    name: item.name,
                    id: item.id,
                    restaurantId: data?.id,
                  },
                })
              }
            />
          ))}
          {perks?.followingBonus && (
            <TouchableOpacity
              style={styles.container}
              onPress={notOwnedNavigation}
            >
              <View style={styles.perkDetails}>
                <TicketStar size={28} color={Color.base.White} />
                <Text style={styles.perkText}>{perks.followingBonus.name}</Text>
              </View>
              <View>
                <Text style={styles.perkCount}>
                  {perks.followingBonus.current}/{perks.followingBonus.target}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNavigation}>
            <View style={styles.addPerkButton}>
              <Add color={Color.base.White} size={24} />
              <Text style={styles.addPerkText}>Add Perk</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <LinearGradient
            colors={[Color.Brand.card.start, Color.Brand.card.end]}
            style={styles.gradientContainer}
          >
            <View style={styles.noPerksContainer}>
              <View style={styles.noPerksIcon}>
                <PerkGradient />
              </View>
              <Text style={styles.noPerksText}>
                You do not have any perks yet. {"\n"}
                Check-in to unlock some, or redeem others with {"\n"}
                your bitcoin balance.
              </Text>
            </View>
          </LinearGradient>
          <TouchableOpacity onPress={handleNavigation}>
            <View style={styles.addPerkButton}>
              <Add color={Color.base.White} size={24} />
              <Text style={styles.addPerkText}>Add Perk</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderDetails = () => (
    <View style={styles.detailsContainer}>
      <DetailsSheet data={data} />
    </View>
  );

  const renderMenu = () => {
    const totalItems = getTotalQuantity();

    const handleAdd = (item: MenuItem) => {
      addItem({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        description: item.description,
        quantity: 1,
      });
    };

    const handleMinus = (itemId: string) => {
      removeItem(itemId);
    };

    const handleCardPress = (item: MenuItem) => {
      router.push({
        pathname: `/Menu/${item.id}`,
        params: {
          name: item.name,
          image: JSON.stringify(item.image),
          description: item.description,
          price: item.price,
          category: item.category,
        },
      });
    };

    return (
      <>
        <View style={styles.menuWrapper}>
          <ScrollView
            style={styles.menuScrollView}
            contentContainerStyle={[
              styles.menuContent,
              totalItems > 0 && styles.menuContentWithCart,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {mockMenuData.categories.map((category, categoryIndex) => (
              <View key={categoryIndex} style={styles.menuCategory}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                {category.items.map((item) => (
                  <MenuCard
                    key={item.id}
                    name={item.name}
                    image={item.image}
                    description={item.description}
                    price={item.price}
                    onPress={() => handleCardPress(item)}
                    onAdd={() => handleAdd(item)}
                    onMinus={() => handleMinus(item.id)}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <GestureHandlerRootView style={styles.attrContainer}>
      <View>
        <Animated.View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "perks" && styles.activeButton,
            ]}
            onPress={() => setActiveTab("perks")}
          >
            <Text
              style={[
                styles.buttonText,
                activeTab !== "perks" && styles.activeText,
              ]}
            >
              Perks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "menu" && styles.activeButton,
            ]}
            onPress={() => setActiveTab("menu")}
          >
            <Text
              style={[
                styles.buttonText,
                activeTab !== "menu" && styles.activeText,
              ]}
            >
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "details" && styles.activeButton,
            ]}
            onPress={() => setActiveTab("details")}
          >
            <Text
              style={[
                styles.buttonText,
                activeTab !== "details" && styles.activeText,
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator color={Color.Gray.gray600} />
        ) : activeTab === "perks" ? (
          renderPerks()
        ) : activeTab === "menu" ? (
          renderMenu()
        ) : (
          renderDetails()
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  attrContainer: {
    flex: 1,
    marginTop: 32,
    marginBottom: 40,
  },
  menuWrapper: {
    flex: 1,
    position: "relative",
  },
  menuScrollView: {},
  menuContent: {
    paddingBottom: 16,
  },
  menuContentWithCart: {
    paddingBottom: 100, // Adjust this value based on your cart summary height
  },
  cartPadding: {
    height: 100,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Color.Gray.gray500,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 48,
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: "center",
    width: "32%",
  },
  activeButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 48,
  },
  buttonText: {
    ...BUTTON_40,
    color: Color.base.White,
  },
  activeText: {
    color: Color.base.White,
  },
  contentContainer: {
    flex: 1,
    marginTop: 24,
  },
  powerUpGrid: {
    gap: 15,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    ...BODY_1_BOLD,
    color: Color.base.White,
  },
  container: {
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 23,
    paddingRight: 30,
    paddingLeft: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
  perkDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  perkText: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
  },
  perkCount: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    fontWeight: "600",
  },
  addPerkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: Color.Gray.gray400,
    height: 48,
    borderRadius: 48,
  },
  addPerkText: {
    ...BUTTON_48,
    color: Color.base.White,
  },
  gradientContainer: {
    borderRadius: 16,
  },
  noPerksContainer: {
    gap: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  noPerksIcon: {
    padding: 12,
    backgroundColor: Color.Gray.gray400,
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    borderRadius: 12,
  },
  noPerksText: {
    textAlign: "center",
    ...CAPTION_1_REGULAR,
    color: Color.Gray.gray50,
  },
  detailsContainer: {
    flex: 1,
    marginBottom: 450,
  },
  menuCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    ...BODY_1_BOLD,
    color: Color.base.White,
    marginBottom: 16,
  },
});

export default Owned;
