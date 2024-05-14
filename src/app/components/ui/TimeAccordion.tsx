import React from 'react'
import { View, Text } from 'react-native'
import Color from '@/app/constants/Color';

interface TimetableProps {
    title: string;
    time: string;
}

const TimeAccordion: React.FC<TimetableProps> = ({ time, title }) => {
  return (
    <View style={{ flexDirection: 'column', gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Text style={{ fontSize: 14, color: Color.Gray.gray100 }}>
                {title}
            </Text>
            <Text style={{ fontSize: 14, color: Color.Gray.gray50 }}>
                {time}
            </Text>
        </View>
        <View style={{ height: 1, width: '100%', backgroundColor: Color.Gray.gray400 }}/>
    </View>
  )
}

export default TimeAccordion