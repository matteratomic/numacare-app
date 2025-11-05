import React from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useRouter } from 'expo-router';
import { Feather } from "@expo/vector-icons";
// Sample London route (Honor Oak → Bell Green-ish)
const ROUTE = [
  { latitude: 51.4529, longitude: -0.0445 }, // start (black dot)
  { latitude: 51.4558, longitude: -0.0399 },
  { latitude: 51.4569, longitude: -0.0312 },
  { latitude: 51.4489, longitude: -0.0225 },
  { latitude: 51.4369, longitude: -0.0212 }, // end (yellow pin)
];

const INITIAL_REGION: Region = {
  latitude: 51.447,
  longitude: -0.035,
  latitudeDelta: 0.07,
  longitudeDelta: 0.07,
};

export default function MapTrackingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-[#161616]">
        {/* Map */}
        <MapView
          style={{ flex: 1 }}
          initialRegion={INITIAL_REGION}
          provider={PROVIDER_GOOGLE}
          customMapStyle={lightMapStyle} // optional styling below
        >
          {/* Route polyline */}
          <Polyline
            coordinates={ROUTE}
            strokeColor="#111111"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />

          {/* Start marker (black dot) */}
          <Marker coordinate={ROUTE[0]} anchor={{ x: 0.5, y: 0.5 }}>
            <View className="w-3 h-3 rounded-full bg-black" />
          </Marker>

          {/* End marker (yellow pin with black center) */}
          <Marker coordinate={ROUTE[ROUTE.length - 1]}>
            <View className="items-center">
              <View style={{ backgroundColor: "#0ea5e9", borderColor: "#0ea5e9" }} className="w-6 h-6 rounded-full bg-yellow-400 border-[2px] border-yellow-500 items-center justify-center">
                <View className="w-2.5 h-2.5 rounded-full bg-white" />
              </View>
              <View style={{ backgroundColor: "#0ea5e9" }} className="w-1 h-2 bg-yellow-500 rounded-b-md" />
            </View>
          </Marker>
        </MapView>

        {/* Header overlay */}
        <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              router.back()
            }}
            className="w-10 h-10 rounded-full bg-white/90 items-center justify-center">
            <Feather name="arrow-left" size={20} />
          </TouchableOpacity>
          <Text className="text-white/90 text-base">Live tracking</Text>
          <View className="w-10" />{/* spacer */}
        </View>

        {/* Bottom card */}
        <View
          className="absolute left-4 right-4 bottom-6 rounded-2xl bg-white p-4"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
          {/* Top row: Delivery ID + pill */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-xs">Delivery ID</Text>
              <Text className="font-semibold text-base">#964201832-DL</Text>
            </View>
            <View style={{ backgroundColor: "#0ea5e9" }} className="px-3 py-1 rounded-full bg-yellow-400/90">
              <Text className="text-white text-xs font-semibold">On the way</Text>
            </View>
          </View>

          {/* Grid details */}
          <View className="mt-4 flex-row">
            <View className="flex-1">
              <Text className="text-gray-500 text-xs">Item</Text>
              <Text className="font-medium">Smart Knee Brace</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-xs">Weight</Text>
              <Text className="font-medium">250 g</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-xs">To</Text>
              <Text className="font-medium">Jordan Lee</Text>
            </View>
          </View>

          {/* Divider */}
          <View className="my-4 h-[1px] bg-gray-200" />

          {/* Courier row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: "https://i.pravatar.cc/100?img=13" }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View>
                <Text className="font-semibold">Sam McAlen</Text>
                <Text className="text-gray-500 text-xs">Delivery man</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="message-circle" size={20} />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="phone" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Optional light map style (subtle, like the screenshot) */
const lightMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e6ff" }] },
];
