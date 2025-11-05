import React from "react";
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';

const PRIMARY = "#0ea5e9";

type Status = "on_the_way" | "delivered";
type HistoryItem = {
  id: string;
  label: string;
  subtitle: string;
  status: Status;
};

const HISTORY: HistoryItem[] = [
  { id: "#964201832-DL", label: "#964201832-DL", subtitle: "Left warehouse on Feb 21", status: "on_the_way" },
  { id: "#964201486-DL", label: "#964201486-DL", subtitle: "Received on Jan 8", status: "delivered" },
  { id: "#964201195-DL", label: "#964201195-DL", subtitle: "Received Dec 14", status: "delivered" },
];

function StatusPill({ status }: { status: Status }) {
  if (status === "on_the_way") {
    return (
      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: PRIMARY }}>
        <Text className="text-xs font-semibold text-white">On the way</Text>
      </View>
    );
  }
  return (
    <View className="px-3 py-1 rounded-full bg-gray-100">
      <Text className="text-xs font-semibold text-gray-700">Delivered</Text>
    </View>
  );
}

function ActionButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center rounded-2xl bg-white py-3"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <View className="mb-2">{icon}</View>
      <Text className="text-xs font-medium text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
}

export default function OrdersHomeScreen() {
const router = useRouter();
  return (
    <View style={{padding:24,paddingHorizontal:8,paddingTop:64}} className=" flex-1 bg-white"> 
      <View className="px-4">
        <View className="flex-row items-center rounded-2xl bg-gray-100 px-3 py-2">
          <Feather name="search" size={18} />
          <TextInput
            placeholder="Track package..."
            placeholderTextColor="#808080"
            className="flex-1 ml-2 text-[15px] py-1"
          />
          <TouchableOpacity className="w-9 h-9 rounded-xl bg-white items-center justify-center ml-2"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}
          >
            <Ionicons name="scan-outline" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary card */}
      <View className="px-4 mt-4">
        <View
          className="rounded-2xl p-4 overflow-hidden"
          style={{
            backgroundColor: PRIMARY,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 5,
          }}
        >
          <Text className="text-white/90 text-xs">Nearest delivery</Text>
          <Text className="text-white font-extrabold text-lg mt-1">#964201832-DL</Text>
          <Text className="text-white/90 mt-2">Arrived to sorting facility</Text>
          <Text className="text-white/80 text-xs">Feb 21</Text>

          {/* Right-side illustration placeholder */}
          <View className="absolute right-3 bottom-3 opacity-90">
            <MaterialCommunityIcons name="package-variant-closed" size={64} color="white" />
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View className="px-4 mt-4">
        <View className="flex-row gap-3">
          <ActionButton
            label="Price"
            icon={<Feather name="tag" size={18} />}
          />
          <ActionButton
            label="Point"
            icon={<Feather name="map-pin" size={18} />}
          />
          <ActionButton
            label="Activity"
            icon={<Feather name="activity" size={18} />}
          />
          <ActionButton
            label="Support"
            icon={<Feather name="help-circle" size={18} />}
          />
        </View>
      </View>

      {/* Shipping history header */}
      <View className="px-4 mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Shipping history</Text>
        <TouchableOpacity 
          onPress={()=>{
            router.push('/orders')
          }}
          className="flex-row items-center">
          <Text className="text-gray-600 mr-1">See all</Text>
          <Feather name="chevron-right" size={18} color="#525252" />
        </TouchableOpacity>
      </View>

      {/* History list */}
      <View className="px-4 mt-3">
        {HISTORY.map((item, idx) => (
          <View key={item.id} className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <MaterialCommunityIcons name="cube-outline" size={20} color="#2e2e2e" />
              </View>
              <View>
                <Text className="font-semibold">{item.label}</Text>
                <Text className="text-gray-500 text-xs">{item.subtitle}</Text>
              </View>
            </View>
            <StatusPill status={item.status} />
          </View>
        ))}
      </View>
    </View>
  );
}
