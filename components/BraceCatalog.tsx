import React, { useMemo, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";

const PRIMARY = "#0ea5e9";

/** Types */
type Product = {
  id: string;
  name: string;
  price: number;        // USD for demo
  compareAtPrice?: number;
  rating?: number;      // 0..5
  reviews?: number;
  image: string;
  description: string;
  sides?: ("Left" | "Right" | "Both")[];
  sizes?: ("XS" | "S" | "M" | "L" | "XL")[];
};

type BraceCatalogProps = {
  products?: Product[];
  onAddToCart?: (payload: {
    product: Product;
    side?: Product["sides"][number];
    size?: Product["sizes"][number];
  }) => void;
  /** Limit the height if embedding inside a smaller section */
  maxHeight?: number;
};

const truncalCompression = require("../assets/IMG_0296.jpg")
const truncalCompression2 = require("../assets/TruncalCompression.png")
const legCompression = require("../assets/IMG_0298.jpg")
const armGuardPlus = require("../assets/IMG_0300.jpg")
const armGuardPlus2 = require("../assets/IMG_0303.jpg")
const aerosCompressionPump = require("../assets/IMG_0318.jpg")
const DEMO_PRODUCTS: Product[] = [
  {
    id: "truncal-compression",
    name: "Truncal Compression",
    price: 79.0,
    compareAtPrice: 99.0,
    rating: 4.7,
    reviews: 1537,
    image: truncalCompression,
    // image2: truncalCompression2,
    description: "Designed to provide bilateral leg compression with additional chambers above the waist to address abdominal swelling and lymphatic flow.",
    sides: ["Left", "Right", "Both"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "leg-compression",
    name: "Leg Compression",
    price: 79.0,
    compareAtPrice: 99.0,
    rating: 4.7,
    reviews: 1537,
    image: legCompression,
    description:
      "Breathable hinged knee brace that supports MCL/LCL with adjustable straps and lightweight frame.",
    sides: ["Left", "Right", "Both"],
    sizes: ["Ankle", "Calf", "Thigh"],
  },
  {
    id: "Arm Guard Plus",
    name: "Arm Guard Plus",
    price: 79.0,
    compareAtPrice: 99.0,
    rating: 4.7,
    reviews: 1537,
    image: armGuardPlus,
    image2: armGuardPlus2,
    description:
      "Effective post-mastectomy lymphedema therapy. AIROS Medical's Arm Plus garments treat lymphedema present in the arm, shoulder and upper truncal region.",
    sides: ["Left", "Right"],
    sizes: ["Forecep", "Bicep", "Shoulder"],
  },
  {
    id: "Aeros Compression Pump",
    name: "Aeros Compression Pump",
    price: 79.0,
    compareAtPrice: 99.0,
    rating: 4.7,
    reviews: 1537,
    image: aerosCompressionPump,
    description:
      "The AIROS Pump is an FDtA-cleuared Sequential Compression Device that provides intermittent pneumatic compression therapy treatment for both the upper and lower extremities as well as the trunk. This device features chambers that inflate and deflate, providing advanced treatment options for patients suffering from lymphedema in the legs or arms, abdominal and pelvic swelling, breast-cancer related lymphedema, lipedema, or venous insufficiency.",
    // sides: ["Left", "Right", "Both"],
    sides: ["Aeros 6 EO651", "Aeros 8 E0652"],
    // sizes: ["S", "M", "L", "XL"],
  },

]


/** Small helper UI */
function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 py-2 rounded-xl mr-2 mb-2"
      style={{
        borderWidth: 1.5,
        borderColor: selected ? PRIMARY : "#e5e7eb",
        backgroundColor: selected ? `${PRIMARY}20` : "white",
      }}
    >
      <Text style={{ color: selected ? PRIMARY : "#111827", fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PriceRow({ product }: { product: Product }) {
  return (
    <View className="flex-row items-end">
      <Text className="text-[16px] font-semibold">${product.price.toFixed(2)}</Text>
    </View>
  );
}

/** Main component */
export default function BraceCatalog({
  products = DEMO_PRODUCTS,
  onAddToCart,
  maxHeight = 540,
}: BraceCatalogProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Product | null>(null);
  const [side, setSide] = useState<Product["sides"][number] | undefined>();
  const [size, setSize] = useState<Product["sizes"][number] | undefined>();
  const { height } = Dimensions.get('window')

  const openModal = (p: Product) => {
    setActive(p);
    // sensible defaults
    setSide(p.sides?.[0]);
    setSize(p.sizes?.[1] ?? p.sizes?.[0]);
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  const canAdd = useMemo(() => !!active && (!active.sides || !!side) && (!active.sizes || !!size), [
    active,
    side,
    size,
  ]);

  return (
    <View style={{ maxHeight, minWidth: 300 }} className="w-full">
      {/* Grid list */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openModal(item)}
            className="flex-1 rounded-2xl"
          >
            <Image
              style={{ height: 112, borderWidth: 1, borderColor: "#0ea5e9" }}
              source={item.image}
              className="rounded-lg w-full h-28 rounded-t-2xl"
              resizeMode="cover"
            />
            <View className="p-3 mt-3">
              <Text numberOfLines={2} className="font-semibold text-[13px]">
                {item.name}
              </Text>
              {/* <View className="mt-1"> */}
              {/*   <PriceRow product={item} /> */}
              {/* </View> */}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={open} presentationStyle="formSheet" animationType="slide" onRequestClose={closeModal}>
        <View style={{ height, backgroundColor: "rgba(0,0,0,0.5)" }} className="h-screen flex-1 bg-black/30">
          <View className="flex-1 mt-auto bg-white rounded-t-3xl overflow-hidden">
            {/* Header image */}
            <Image
              style={{ height: height / 2 }}
              // source={{ uri: active?.image }}
              source={active?.image2 ?? active?.image}
              className="w-full h-64"
              resizeMode="cover"
            />

            <ScrollView className="px-4 pt-3" contentContainerStyle={{ padding: 8 }}>
              {/* Title + rating */}
              {/* <Text className="text-gray-500 text-xs"> */}
              {/*   To my patient • <Text>★ {active?.rating ?? 4.6}</Text>{" "} */}
              {/*   <Text className="text-gray-400"> */}
              {/*     ({active?.reviews?.toLocaleString() ?? "1,200"} reviews) */}
              {/*   </Text> */}
              {/* </Text> */}

              <Text className="text-3xl font-extrabold mt-1">
                {active?.name ?? "Brace"}
              </Text>

              {/* Config: Side */}
              {!!active?.sides?.length && (
                <View className="mt-4">
                  {/* <Text className="text-gray-700 font-semibold mb-2">Side</Text> */}
                  <View className="flex-row flex-wrap">
                    {active.sides.map((s) => (
                      <Chip key={s} label={s} selected={side === s} onPress={() => setSide(s)} />
                    ))}
                  </View>
                </View>
              )}

              {/* Config: Size */}
              {!!active?.sizes?.length && (
                <View className="mt-6">
                  <Text className="text-gray-700 font-semibold mb-2">Measurements</Text>
                  <View className="flex-row items-center mt-2">
                    {active.sizes.map((s) => (
                      <View key={s} style={{ marginRight: 16 }} className="flex flex-row">
                        <Text style={{ color: "#111827", fontWeight: "600" }}>
                          {s}
                        </Text>
                        <TextInput keyboardType="numeric" className="font-semibold text-center"
                          style={{
                            borderBottomWidth: 1,
                            height: Platform.OS === 'android' ? 8 : "auto",
                            borderBottomColor: "black",
                            width: 32,
                            marginLeft: 4
                          }} />
                        <Text className="text-sm" style={{ color: "#111827", fontWeight: "600" }}>
                          cm
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Description */}
              <Text style={{ lineHeight: 20 }} className="text-gray-600 text-lg mt-4">
                {active?.description ??
                  "Medical-grade brace designed for stability and comfort during rehabilitation."}
              </Text>

              {/* Price row */}
              <View style={{ marginTop: 64, marginBottom: 16, transform: [{ translateY: -16 }] }}
                className="flex-1 flex-row items-center justify-between">
                <Pressable
                  disabled={!canAdd}
                  onPress={() => {
                    if (active && canAdd) {
                      onAddToCart?.({ product: active, side, size });
                    }
                    closeModal();
                  }}
                  className="w-full rounded-2xl px-6 py-3"
                  style={{
                    paddingHorizontal: 24,
                    backgroundColor: canAdd ? PRIMARY : "#c7eaf9",
                  }}
                >
                  <Text className="text-white text-center font-semibold">Select item</Text>
                </Pressable>
              </View>

              {/* Spacer */}
              <View className="h-4" />
            </ScrollView>

            {/* Close handle */}
            <View className="items-center pb-3">
              <Pressable onPress={closeModal} className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
