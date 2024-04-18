import * as React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Color from "@/app/constants/Color";

const buttonVariants = {
  variant: {
    primary: { 
      zIndex: 0 
    },
    secondary: { backgroundColor: "white" },
    tertiary: { backgroundColor: "#2D3A42" },
    text: { backgroundColor: "transparent" },
  },
  size: {
    default: { paddingVertical: 12, paddingHorizontal: 24, width: "100%" },
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
    text: { paddingVertical: 12, paddingHorizontal: 24 },
  },
};

const textStyles = {
  primary: { fontSize: 16, fontWeight: "bold", color: "white" },
  secondary: { fontSize: 16, fontWeight: "bold", color: "black" },
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
        colors={[Color.Brand.main.start, Color.Brand.main.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
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
  },
});

export default Button;
