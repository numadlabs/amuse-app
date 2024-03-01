import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const buttonVariants = {
    variant: {
        primary: 'bg-gray600', 
        secondary: 'bg-baseWhite',
        tertiary: 'bg-gray50',
        text: 'bg-transparent'
    },
    size: {
        default: 'py-3 px-6 w-full', 
        small: 'py-3 px-6',
        large: 'py-3 px-6',
        text:'py-3 px-6'
    },
};

const textStyles = {
    primary: 'text-md font-bold text-gray50 justify-center items-center', 
    secondary: 'text-md font-bold text-gray600 justify-center items-center',
    tertiary: 'text-lg', 
    text:'text-gray600 font-bold'
};

export interface ButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
    variant?: keyof typeof buttonVariants['variant'];
    size?: keyof typeof buttonVariants['size'];
    textStyle?: keyof typeof textStyles; 
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
    ({ children, style, variant = 'default', size = 'default', textStyle = 'default', ...props }, ref) => {
        return (
            <TouchableOpacity
                className={`
          rounded-[48px] 
          ${buttonVariants.variant[variant]} 
          ${buttonVariants.size[size]}
          style,
        `}
                ref={ref}
                {...props}
            >
                <View style={{alignItems:'center', justifyContent:'center', gap:8}}>
                    <Text className={`${textStyles[textStyle]}`}>{children}</Text>
                </View>
            </TouchableOpacity>
        );
    }
);

export default Button;
