// import React from "react";
// import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
// import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
//
// const PRIMARY = "#0ea5e9";
//
// type Status = "on_the_way" | "delivered";
// type HistoryItem = {
//   id: string;
//   label: string;
//   subtitle: string;
//   status: Status;
// };
//
// const HISTORY: HistoryItem[] = [
//   { id: "#964201832-DL", label: "#964201832-DL", subtitle: "Left warehouse on Feb 21", status: "on_the_way" },
//   { id: "#964201486-DL", label: "#964201486-DL", subtitle: "Received on Jan 8", status: "delivered" },
//   { id: "#964201195-DL", label: "#964201195-DL", subtitle: "Received Dec 14", status: "delivered" },
// ];
//
// function StatusPill({ status }: { status: Status }) {
//   if (status === "on_the_way") {
//     return (
//       <View className="px-3 py-1 rounded-full" style={{ backgroundColor: PRIMARY }}>
//         <Text className="text-xs font-semibold text-white">On the way</Text>
//       </View>
//     );
//   }
//   return (
//     <View className="px-3 py-1 rounded-full bg-gray-100">
//       <Text className="text-xs font-semibold text-gray-700">Delivered</Text>
//     </View>
//   );
// }
//
// function ActionButton({
//   label,
//   icon,
// }: {
//   label: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <TouchableOpacity
//       className="flex-1 items-center justify-center rounded-2xl bg-white py-3"
//       style={{
//         shadowColor: "#000",
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 },
//         elevation: 3,
//       }}
//     >
//       <View className="mb-2">{icon}</View>
//       <Text className="text-xs font-medium text-gray-700">{label}</Text>
//     </TouchableOpacity>
//   );
// }
//
// export default function OrdersHomeScreen() {
//   return (
//     <SafeAreaView className="flex-1 bg-[#0b0b0b]">
//       <View className="flex-1 bg-white">
//         {/* Header */}
//         <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             <Image
//               source={{ uri: "https://i.pravatar.cc/100?img=3" }}
//               className="w-8 h-8 rounded-full mr-2"
//             />
//             <Text className="text-base font-semibold">Robert Jennings</Text>
//           </View>
//           <View className="flex-row gap-3">
//             <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
//               <Ionicons name="person-circle-outline" size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
//               <Ionicons name="notifications-outline" size={20} />
//             </TouchableOpacity>
//           </View>
//         </View>
//
//         {/* Search */}
//         <View className="px-4">
//           <View className="flex-row items-center rounded-2xl bg-gray-100 px-3 py-2">
//             <Feather name="search" size={18} />
//             <TextInput
//               placeholder="Track package..."
//               placeholderTextColor="#808080"
//               className="flex-1 ml-2 text-[15px] py-1"
//             />
//             <TouchableOpacity className="w-9 h-9 rounded-xl bg-white items-center justify-center ml-2"
//               style={{
//                 shadowColor: "#000",
//                 shadowOpacity: 0.06,
//                 shadowRadius: 6,
//                 shadowOffset: { width: 0, height: 3 },
//                 elevation: 2,
//               }}
//             >
//               <Ionicons name="scan-outline" size={18} />
//             </TouchableOpacity>
//           </View>
//         </View>
//
//         {/* Primary card */}
//         <View className="px-4 mt-4">
//           <View
//             className="rounded-2xl p-4 overflow-hidden"
//             style={{
//               backgroundColor: PRIMARY,
//               shadowColor: "#000",
//               shadowOpacity: 0.12,
//               shadowRadius: 10,
//               shadowOffset: { width: 0, height: 6 },
//               elevation: 5,
//             }}
//           >
//             <Text className="text-white/90 text-xs">Nearest delivery</Text>
//             <Text className="text-white font-extrabold text-lg mt-1">#964201832-DL</Text>
//             <Text className="text-white/90 mt-2">Arrived to sorting facility</Text>
//             <Text className="text-white/80 text-xs">Feb 21</Text>
//
//             {/* Right-side illustration placeholder */}
//             <View className="absolute right-3 bottom-3 opacity-90">
//               <MaterialCommunityIcons name="package-variant-closed" size={64} color="white" />
//             </View>
//           </View>
//         </View>
//
//         {/* Quick actions */}
//         <View className="px-4 mt-4">
//           <View className="flex-row gap-3">
//             <ActionButton
//               label="Price"
//               icon={<Feather name="tag" size={18} />}
//             />
//             <ActionButton
//               label="Point"
//               icon={<Feather name="map-pin" size={18} />}
//             />
//             <ActionButton
//               label="Activity"
//               icon={<Feather name="activity" size={18} />}
//             />
//             <ActionButton
//               label="Support"
//               icon={<Feather name="help-circle" size={18} />}
//             />
//           </View>
//         </View>
//
//         {/* Shipping history header */}
//         <View className="px-4 mt-6 flex-row items-center justify-between">
//           <Text className="text-lg font-semibold">Shipping history</Text>
//           <TouchableOpacity className="flex-row items-center">
//             <Text className="text-gray-600 mr-1">See all</Text>
//             <Feather name="chevron-right" size={18} color="#525252" />
//           </TouchableOpacity>
//         </View>
//
//         {/* History list */}
//         <View className="px-4 mt-3">
//           {HISTORY.map((item, idx) => (
//             <View key={item.id} className="flex-row items-center justify-between py-3">
//               <View className="flex-row items-center">
//                 <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
//                   <MaterialCommunityIcons name="cube-outline" size={20} color="#2e2e2e" />
//                 </View>
//                 <View>
//                   <Text className="font-semibold">{item.label}</Text>
//                   <Text className="text-gray-500 text-xs">{item.subtitle}</Text>
//                 </View>
//               </View>
//               <StatusPill status={item.status} />
//             </View>
//           ))}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }


import { View, Text, Animated, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { useEffect, useRef } from 'react';

function TrackerCurrentItem() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 2.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View className="h-16 flex-row items-start rounded-md">
      <View className="items-center justify-center">
        <Animated.View
          style={{
            marginTop: 1,
            zIndex: 2,
            width: 6,
            height: 6,
            borderRadius: 100,
            backgroundColor: "#0ea5e9",
            transform: [{ scale: pulseAnim }],
          }}
        />
        <View style={{ width: 1, height: "100%", backgroundColor: "black" }} />
      </View>

      <View className="px-3">
        <Text className="font-semibold text-2xl">Transferred for delivery</Text>
        <Text className="text-sm text-gray-400">3 - 5 days</Text>
      </View>
    </View>
  );
}

const TrackerItem = ({ title, subtitle }) => {
  return <View className="h-16 flex-row items-start rounded-md">
    <View className="mt-2 items-center justify-center">
      <View style={{ width: 6, height: 6, backgroundColor: 'black', borderRadius: "100%" }}></View>
      <View style={{ width: 1, height: "100%", backgroundColor: 'black' }}></View>
    </View>
    <View className="px-3">
      <Text className="font-semibold">{title}</Text>
      <Text style={{ paddingBottom: 8 }} className="text-sm text-gray-400">{subtitle}</Text>
    </View>
  </View>

}

const Tracker = () => {
  return <View className="mt-8">


    <TrackerItem title="Order confirmed" subtitle="Nov 5, 2025 · 482391 · London" />
    <TrackerItem title="Payment processed" subtitle="Nov 5, 2025 · 482391 · London" />
    <TrackerItem title="Preparing for shipment" subtitle="Nov 6, 2025 · 482391 · London" />
    <TrackerItem title="Package picked up by courier" subtitle="Nov 6, 2025 · 482391 · London" />
    <TrackerCurrentItem />
  </View>
}

const OrderDetails = () => {
  return <View style={{ padding: 16, borderColor: "#d1d5db", }} className="mt-8 border rounded-lg">

    <View style={{ paddingBottom: 4, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#d1d5db' }}
      className="flex-row items-center justify-between">
      <Text className="font-semibold">Item</Text>
      <Text className='text-sm'>Smart Knee Brace</Text>
    </View>

    <View style={{ paddingBottom: 4, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#d1d5db' }}
      className="flex-row items-center justify-between">
      <Text className="font-semibold">Weight</Text>
      <Text className='text-sm'>250 g</Text>
    </View>

    <View style={{ paddingBottom: 4, marginBottom: 0 }}
      className="flex-row items-center justify-between">
      <Text className="font-semibold">Recipient</Text>
      <Text className='text-sm'>Jordan Lee</Text>
    </View>
  </View>
}

export default function StatusTracker() {
  const router = useRouter();
  return <Screen>
    <View
      style={{ marginTop: 32 }}>
      <View>
        <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Order Status
        </Text>
        <View style={{ backgroundColor: "#0ea5e9", borderRadius: 8 }} className="mt-2 rounded-2xl w-24 h-6 items-center justify-center">
          <Text className="font-semibold text-xs text-white">On the way</Text>
        </View>
      </View>
      <Tracker />
      <OrderDetails />

      <TouchableOpacity
        onPress={() => {
          router.push('/map');
        }}
        style={{ borderWidth: 1, borderRadius: 8, borderColor: "#0ea5e9" }}
        className="mt-4 w-full p-4 rounded-lg items-center justify-between flex-row">
        <Text className="font-semibold">View in Map</Text>
        <View style={{ borderRadius: '100%', backgroundColor: "rgba(14,165,233,0.1)" }} className="rounded-full p-2 items-center justify-center">
          <MaterialCommunityIcons name="chevron-right" size={24} color="#0ea5e9" />
        </View>
      </TouchableOpacity>
    </View>

  </Screen>
}

