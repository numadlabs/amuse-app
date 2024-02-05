//index.tsx

import React from "react";
import { Text, View } from "react-native";
import BottomTab from "./components/layout/Footer";
import Login from "./screens/Login";
import { Stack } from "expo-router";
import VerificationCode from "./screens/forgotPassword/VerificationCode";
import ForgotPassword from "./screens/forgotPassword/ForgotPassword";
import NewPassword from "./screens/forgotPassword/NewPassword";
import Success from "./screens/forgotPassword/Success";
import PhoneNumber from "./screens/signUp/PhoneNumber";
import Password from "./screens/signUp/Password";
import NickName from "./screens/signUp/NickName";


export default function Page() {
  return (
    <>
     <Login/>
    </>
  );
}

