import * as React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Color from "@/app/constants/Color";
import { BlurView } from "expo-blur";

const buttonVariants = {
  variant: {
    primary: {
      zIndex: 0
    },
    secondary: { backgroundColor: 'transparent' },
    tertiary: { backgroundColor: "#2D3A42" },
    text: { backgroundColor: "transparent" },
    disabled: { backgroundColor: Color.Gray.gray400 }
  },
  size: {
    default: { paddingVertical: 12, paddingHorizontal: 24, },
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
    text: { paddingVertical: 12, paddingHorizontal: 24 },
  },
};

const textStyles = {
  primary: { fontSize: 16, fontWeight: "bold", color: "white" },
  secondary: { fontSize: 16, fontWeight: "bold", color: "black" },
  disabled: { fontSize: 16, fontWeight: "bold", color: Color.Gray.gray200 },
  tertiary: { fontSize: 18, color: "white" },
  text: { fontSize: 16, fontWeight: "bold", color: "black" },
};

export interface ButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
  variant?: keyof (typeof buttonVariants)["variant"];
  size?: keyof (typeof buttonVariants)["size"];
  textStyle?: keyof typeof textStyles;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      children,
      style,
      variant = "default",
      size = "default",
      textStyle = "default",
      ...props
    },
    ref
  ) => {
    // Render linear gradient for primary variant
    const renderGradient = variant === "primary" && (
      <LinearGradient
        colors={[Color.Brand.secondary.start, Color.Brand.secondary.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={[styles.blurContainer, { borderRadius: 48 }]}>
          <BlurView style={styles.blurView} />
        </View>
      </LinearGradient>
    );

    return (
      <TouchableOpacity
        style={[
          styles.button,
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          style,
        ]}
        ref={ref}
        {...props}
      >
        {renderGradient}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text style={textStyles[textStyle]}>{children}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 48,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    padding: 1
  },
  blurView: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 48,
    overflow: 'hidden', 
  },
});

export default Button;
