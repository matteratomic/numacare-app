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

/** Demo data (limb braces) */
const DEMO_PRODUCTS: Product[] = [
  {
    id: "knee-pro-1",
    name: "Knee Stabilizer Pro",
    price: 79.0,
    compareAtPrice: 99.0,
    rating: 4.7,
    reviews: 1537,
    image: "https://www.shockdoctor.com/cdn/shop/products/SD870-01_KneeStabilizerFlexStays_onBody-1_2048x.jpg?v=1738002197",
    description:
      "Breathable hinged knee brace that supports MCL/LCL with adjustable straps and lightweight frame.",
    sides: ["Left", "Right", "Both"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "ankle-lite-1",
    name: "Ankle Support Lite",
    price: 29.9,
    rating: 4.5,
    reviews: 820,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMwwNpLRuANXSANcbZQGW0M0JeRSSY1yzlyg&s",
    description:
      "Compression ankle sleeve for everyday use. Reduces swelling and offers mild stabilization.",
    sides: ["Left", "Right", "Both"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "wrist-neo-1",
    name: "Wrist NeoGuard",
    price: 24.5,
    rating: 4.6,
    reviews: 1092,
    image: "https://thermoskin.com/cdn/shop/files/Untitleddesign_46_1000x.png?v=1708472325",
    description:
      "Neoprene wrist brace with removable stabilizer. Ideal for sprains and mild carpal support.",
    sides: ["Left", "Right"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "elbow-flex-1",
    name: "Elbow Flex",
    price: 34.0,
    rating: 4.4,
    reviews: 640,
    image: "https://www.santemondial.com/cdn/shop/files/898_SGP4170.jpg?v=1743429901",
    description:
      "Flexible elbow compression sleeve. Enhances circulation and reduces tendon strain.",
    sides: ["Left", "Right", "Both"],
    sizes: ["S", "M", "L", "XL"],
  },
  // {
  //   id: "hip-stability-1",
  //   name: "Hip Stability Wrap",
  //   price: 54.9,
  //   rating: 4.3,
  //   reviews: 214,
  //   image:
  //     "https://images.unsplash.com/photo-1599058945522-28f5b6f1c0a5?q=80&w=1200&auto=format&fit=crop",
  //   description:
  //     "Adjustable hip and groin wrap to support mobility and reduce discomfort during recovery.",
  //   sides: ["Left", "Right"],
  //   sizes: ["M", "L", "XL"],
  // },
];

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
              source={{ uri: item.image }}
              className="rounded-lg w-full h-28 rounded-t-2xl"
              resizeMode="cover"
            />
            <View className="p-3 mt-3">
              <Text numberOfLines={2} className="font-semibold text-[13px]">
                {item.name}
              </Text>
              <View className="mt-1">
                <PriceRow product={item} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={open} presentationStyle="pageSheet" animationType="slide" onRequestClose={closeModal} transparent>
        <View style={{ height, backgroundColor: "rgba(0,0,0,0.5)" }} className="h-screen flex-1 bg-black/30">
          <View className="flex-1 mt-auto bg-white rounded-t-3xl overflow-hidden">
            {/* Header image */}
            <Image
              style={{ height: height / 2 }}
              source={{ uri: active?.image }}
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
                  <Text className="text-gray-700 font-semibold mb-2">Side</Text>
                  <View className="flex-row flex-wrap">
                    {active.sides.map((s) => (
                      <Chip key={s} label={s} selected={side === s} onPress={() => setSide(s)} />
                    ))}
                  </View>
                </View>
              )}

              {/* Config: Size */}
              {!!active?.sizes?.length && (
                <View className="mt-2">
                  <Text className="text-gray-700 font-semibold mb-2">Size</Text>
                  <View className="flex-row flex-wrap">
                    {active.sizes.map((s) => (
                      <Chip key={s} label={s} selected={size === s} onPress={() => setSize(s)} />
                    ))}
                  </View>
                </View>
              )}

              {/* Description */}
              <Text style={{ lineHeight: 20 }} className="text-gray-600 text-lg mt-3">
                {active?.description ??
                  "Medical-grade brace designed for stability and comfort during rehabilitation."}
              </Text>

              {/* Price row */}
              <View style={{ marginTop: 64 }} className="flex-1 flex-row items-center justify-between">
                <PriceRow product={active ?? DEMO_PRODUCTS[0]} />
                <Pressable
                  disabled={!canAdd}
                  onPress={() => {
                    if (active && canAdd) {
                      onAddToCart?.({ product: active, side, size });
                    }
                    closeModal();
                  }}
                  className="rounded-2xl px-6 py-3"
                  style={{
                    paddingHorizontal: 24,
                    backgroundColor: canAdd ? PRIMARY : "#c7eaf9",
                  }}
                >
                  <Text className="text-white font-semibold">Select item</Text>
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
