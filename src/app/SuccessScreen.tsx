import { View } from "react-native";
import React, { useState, useEffect } from "react";
import PowerUp from "./components/(feedback)/PowerUp";


const SuccessScreen = () => {
  const [isPopupVisible, setPopupVisible] = useState<boolean>(true);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    togglePopup();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <PowerUp isVisible={isPopupVisible} onClose={togglePopup} />
    </View>
  );
};

export default SuccessScreen;
