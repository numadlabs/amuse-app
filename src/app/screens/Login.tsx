import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Button from '../components/ui/Button';
import { EyeSlash, Eye } from 'iconsax-react-native'; // Assuming you have Eye icon imported as well
import Divider from '../components/atom/Divider';
import { Link, useNavigation } from 'expo-router';
import Color from '../constants/Color';

function Login() {
    const [loading, setLoading] = useState(false);
    const [hidePass, setHidePass] = useState(true);
    const [password, setPassword] = useState('');

    const dismiss = () => {
        Keyboard.dismiss();
    };

    const navigation = useNavigation()


    const handleLogin = () => {
        // Implement your login logic here
        console.log('Login button pressed');
    };

    return (
        <TouchableWithoutFeedback onPress={dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ padding: 20, borderRadius: 20, width: '100%', borderWidth: 1, borderColor: 'black' }}>
                    <Text style={{ fontSize: 24, color: Color.Gray.gray500, fontWeight: 'bold', textAlign: 'center' }}>Welcome</Text>
                    <Text style={{ fontSize: 14, color: Color.Gray.gray400, textAlign: 'center', marginTop: 10 }}>Enter your phone number and password</Text>
                    <View style={{ marginTop: 20 }}>
                        <TextInput inputMode='numeric' placeholder='Phone number' style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 16, paddingHorizontal: 10 }} />
                        <View style={{ position: 'relative', marginTop: 10 }}>
                            <TextInput
                                secureTextEntry={hidePass}
                                placeholder='Password'
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 16, paddingHorizontal: 10 }}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <EyeSlash color='#212121' size={20} />
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button variant='primary' textStyle='primary' size='default'>
                            Log in
                        </Button>
                        <Button variant='text' textStyle='text' size='default'>
                            <Link href={'/screens/forgotPassword/ForgotPassword'}>
                                Forgot password?
                            </Link>
                        </Button>
                        <Divider />
                        <Button variant='tertiary' size='default' textStyle='secondary' onPress={() => navigation.navigate('/screens/signup/phonenumber')}>Sign up</Button>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default Login;
