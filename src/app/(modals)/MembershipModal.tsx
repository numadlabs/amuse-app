import React from "react";
import { View, Text, TouchableWithoutFeedback, Modal, ScrollView } from "react-native";
import Color from "../constants/Color";

const MembershipModal = () => {
    return(
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 24,
                  paddingBottom: 24,
                  gap: 24,
                }}
              >
                <Text>aslfkn</Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
};

export default MembershipModal