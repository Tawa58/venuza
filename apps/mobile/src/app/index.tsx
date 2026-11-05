import { glassGlow, type GlassGlowName } from "@venuza/design-tokens";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseClientStatus } from "@/components/firebase-client-status";

const labels: Record<GlassGlowName, string> = {
  main: "Main",
  secondary: "Secondary",
  electricViolet: "Electric violet",
  cyan: "Cyan",
  nearWhite: "Near-white",
  mutedGrey: "Muted grey",
};

const colorNames = Object.keys(glassGlow) as GlassGlowName[];

export default function ProofScreen() {
  return (
    <View className="flex-1 bg-main">
      <LinearGradient
        colors={[glassGlow.electricViolet, "transparent"]}
        style={{ position: "absolute", top: -80, left: 0, right: 0, height: 320 }}
      />
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerClassName="grow justify-center px-5 py-8">
          <Animated.View entering={FadeInDown.duration(450)}>
            <View className="overflow-hidden rounded-3xl border border-white/10">
              <BlurView intensity={28} tint="dark" className="absolute inset-0" />
              <View className="bg-secondary/80 p-6">
                <View className="mb-4 flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet/20">
                    <Sparkles color={glassGlow.electricViolet} size={22} />
                  </View>
                  <View>
                    <Text className="text-xs tracking-widest text-cyan uppercase">Glass Glow</Text>
                    <Text className="text-4xl font-semibold text-ink">Venuza</Text>
                  </View>
                </View>
                <Text className="text-lg text-muted">Discover. Connect. Experience.</Text>
                <View className="mt-6 flex-row flex-wrap gap-3">
                  {colorNames.map((name) => (
                    <View
                      key={name}
                      className="w-[47%] rounded-2xl border border-white/10 bg-main/50 p-3"
                    >
                      <View
                        className="mb-3 h-10 rounded-xl border border-white/10"
                        style={{ backgroundColor: glassGlow[name] }}
                      />
                      <Text className="text-sm text-ink">{labels[name]}</Text>
                      <Text className="font-mono text-xs text-muted">{glassGlow[name]}</Text>
                    </View>
                  ))}
                </View>
                <FirebaseClientStatus />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
