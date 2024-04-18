import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Color from "@/app/constants/Color";

const buttonVariants = {
  variant: {
    primary: { backgroundColor: "black", zindex:0 },
    secondary: { backgroundColor: "white" },
    tertiary: { backgroundColor: "#2D3A42" },
    text: { backgroundColor: "transparent" },
  },
  size: {
    default: { paddingVertical: 12, paddingHorizontal: 24, width: "100%" },
    small: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 12, paddingHorizontal: 24 },
    text: { paddingVertical: 12, paddingHorizontal: 24 },
  },
};

const textStyles = {
  primary: { fontSize: 16, fontWeight: "bold", color: "white" },
  secondary: { fontSize: 16, fontWeight: "bold", color: "white" },
  tertiary: { fontSize: 18, color: "white" },
  text: { fontSize: 16, fontWeight: "bold", color: "white" },
};

export interface ButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
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
    return (
      <TouchableOpacity
        style={[
          {
            borderRadius: 48,
            overflow: "hidden",
          },
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          style,
        ]}
        ref={ref}
        {...props}
      >
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

export default Button;
