import { View, Text } from 'react-native'
import React from 'react'
import { Path, Rect, Svg } from 'react-native-svg'

const PowerUpLogo = () => {
  return (
    <Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <Rect width="56" height="56" rx="12" fill="#141414"/>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M39.1937 19.0048C40.6467 17.6987 42.098 17 43.4936 17C43.8882 17 44.2437 17.0575 44.514 17.2028C44.8055 17.3595 45 17.6242 45 17.9733C45 18.487 44.5712 18.7977 44.038 19.0141C43.4787 19.241 42.6212 19.4416 41.4047 19.6494C41.4042 19.6494 41.4037 19.6495 41.4032 19.6496L39.7336 19.9487C38.2024 21.3004 36.6151 23.8326 33.718 29.7338C32.0323 33.1684 30.699 35.0747 28.8794 36.4298C29.6201 36.9663 30.3856 37.2488 30.9567 37.2488C31.9742 37.2488 32.9435 36.6779 34.2942 35.0376L34.5329 34.7477L35.3203 35.4226L35.0865 35.6961C33.5275 37.52 32.3947 38.2917 30.9567 38.2917C30.0107 38.2917 28.9454 37.8108 27.9552 37.0249C27.0526 37.514 26.0529 37.8031 24.9795 37.8031C24.3277 37.8031 23.7329 37.6432 23.2896 37.3472C22.8423 37.0486 22.5361 36.5979 22.5361 36.0482C22.5361 34.9519 23.6157 34.2689 24.8276 34.2689C26.0077 34.2689 26.8728 34.7028 28.0756 35.7587C29.5217 34.7388 30.8765 32.9905 32.4048 30.028C31.8929 30.0004 31.5382 29.9869 31.1847 29.9869C29.6206 29.9869 27.8284 30.0329 26.6886 30.2057C23.8292 33.4512 21.6489 35.6379 19.7889 37.0163C17.9011 38.4153 16.3187 39 14.6714 39C13.8763 39 13.1983 38.7631 12.7186 38.2894C12.2389 37.8157 12 37.147 12 36.3658C12 35.2222 12.4888 33.9285 13.2509 32.6533C14.0171 31.371 15.0801 30.0733 16.2763 28.9135C17.4726 27.7536 18.8114 26.7226 20.1352 25.9794C21.4525 25.2399 22.7869 24.7674 23.9665 24.7674C24.4163 24.7674 24.8218 24.8792 25.1203 25.1327C25.4263 25.3926 25.5742 25.7628 25.5742 26.1803C25.5742 26.7594 25.2764 27.4839 24.8246 28.2215C24.5432 28.681 24.1901 29.1645 23.7808 29.6478C24.4681 29.4946 25.2632 29.3521 26.1353 29.2344C32.2201 22.275 35.3712 19.7607 39.1937 19.0048ZM27.1433 36.3106C26.2368 35.5586 25.6207 35.3117 24.8276 35.3117C24.4308 35.3117 24.1168 35.4131 23.9126 35.5563C23.7133 35.6961 23.624 35.8681 23.624 36.0482C23.624 36.1935 23.7086 36.3606 23.9442 36.5082C24.1805 36.6563 24.5393 36.7603 24.9795 36.7603C25.7498 36.7603 26.4698 36.6104 27.1433 36.3106ZM32.9131 29.001C35.0914 24.5596 36.5086 22.0763 37.869 20.4346C35.14 21.4396 32.4182 23.7444 27.6845 29.079C28.8702 28.9887 30.3411 28.9441 31.5899 28.9441C31.9566 28.9441 32.3597 28.9635 32.9131 29.001ZM25.0752 30.431C24.1552 30.592 23.2282 30.8017 22.452 31.0241C22.0061 31.4166 21.6156 31.7312 21.2669 31.9513C20.9065 32.1786 20.5498 32.3318 20.1927 32.3318C20.0362 32.3318 19.876 32.2801 19.7531 32.1616C19.6294 32.0423 19.5728 31.8834 19.5728 31.7249C19.5728 31.3748 19.8388 31.0847 20.1826 30.8583C20.534 30.6267 21.0616 30.3964 21.8087 30.1784C22.594 29.4799 23.2651 28.6903 23.7408 27.962C24.2405 27.197 24.4862 26.558 24.4862 26.1803C24.4862 25.9967 24.4351 25.9336 24.3975 25.9035C24.3437 25.8604 24.2223 25.8102 23.9665 25.8102C23.0338 25.8102 21.8843 26.2073 20.6616 26.9044C19.4464 27.5971 18.1932 28.5664 17.0619 29.6634C15.9306 30.7605 14.9306 31.9762 14.2159 33.1562C13.4964 34.3441 13.0879 35.4599 13.0879 36.3658C13.0879 36.9392 13.2416 37.3231 13.4823 37.5643C13.7224 37.8047 14.103 37.9572 14.6714 37.9572C16.0629 37.9572 17.4437 37.4676 19.1748 36.1826C20.7718 34.9973 22.6454 33.1512 25.0752 30.431ZM21.066 31.2101C20.8653 31.2984 20.7087 31.3831 20.5891 31.4619C20.5415 31.4932 20.5019 31.5222 20.469 31.5485C20.5807 31.5068 20.7135 31.4401 20.8725 31.3398C20.9345 31.3007 20.9989 31.2575 21.066 31.2101ZM41.5712 18.5913C42.3595 18.4376 42.9642 18.2944 43.3828 18.1548C43.4958 18.1171 43.5903 18.0813 43.6681 18.0478C43.6167 18.0446 43.5587 18.0428 43.4936 18.0428C42.9248 18.0428 42.2679 18.2265 41.5712 18.5913Z" fill="white"/>
    </Svg>
    
  )
}

export default PowerUpLogo