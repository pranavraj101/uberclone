import { icons } from '@/constants'
import { router } from 'expo-router'
import React, { useRef } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Map } from './Map'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'

export const RideLayout = ({title, children, snapPoints}: {title: String,  children: React.ReactNode, snapPoints: string[]}) => {

  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <View className="flex flex-col h-screen bg-blue-500">
          <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
            <TouchableOpacity onPress={()=>router.back()}>
              <View>
                <Image source={icons.backArrow} resizeMode="contain" className="w-10 h-10 bg-white rounded-full items-center justify-center" />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaSemiBold ml-5">
              {title || 'Go Back'}
            </Text>
          </View>
          <Map/> 
        </View>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints||['45%','85%']} index={0}>
          <BottomSheetView style={{flex:1, padding:20}}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
      {/* {children} */}
    </GestureHandlerRootView>
  )
}
