import React, { useState } from 'react'
import { View, Text,TextInput,  TouchableWithoutFeedback, Keyboard } from 'react-native'
import Button from '../components/ui/Button'
import { EyeSlash } from 'iconsax-react-native'
import Divider from '../components/atom/Divider'


function Login() {

    const [hidePass, setHidePass] = useState(true)
    const [password, setPassword] = useState('');

    const dismiss = () => {
        Keyboard.dismiss()
    }
    return (
        <TouchableWithoutFeedback onPress={dismiss}>
        <View className='flex flex-1 justify-center items-center px-4 bg-baseWhite'>
            <View className='px-4 py-6 rounded-xl w-full  border border-baseBlack '>
                <View className='flex justify-center flex-row '>
                    <Text className='text-2xl font-bold'>
                        Welcome
                    </Text>
                </View>
                <View className='flex flex-row justify-center'>
                    <Text className='text-gray400 text-sm'>
                        Enter your phone number and password
                    </Text>
                </View>
                <View className='my-6 gap-3'>
                    <TextInput inputMode='numeric' placeholder='Phone number' className='h-12 border border-gray50 focus:border-gray600 text-gray600 rounded-xl px-4 py-2' />
                    <View className='relative'>
                        <TextInput secureTextEntry={true} placeholder='Password' className='h-12 border border-gray50 focus:border-gray600 text-gray600 rounded-xl px-4 py-2' />
                        <View className='absolute right-3 top-3 flex-row items-center'>
                            <EyeSlash color='#212121' size={20} />
                        </View>
                    </View>
                </View>
                <View className='gap-3'>
                    <Button variant='primary' textStyle='primary' onPress={alert} size='default'>
                        Log in
                    </Button>
                    <Button variant='text' textStyle='text' size='default'>
                        Forgot password?
                    </Button>
                    <Divider/>
                    <Button variant='tertiary' size='default' textStyle='secondary'>Sign up</Button>
                </View>
            </View>
           
        </View>
        </TouchableWithoutFeedback>
    )
}

export default Login

