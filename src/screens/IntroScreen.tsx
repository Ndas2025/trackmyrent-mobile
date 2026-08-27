import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BarChart3, CircleDollarSign, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../components/ui";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Intro">;

const slides = [
  {
    icon: CircleDollarSign,
    eyebrow: "Collections",
    title: "Know what came in today",
    description: "See rent collected, pending amounts, and payment status at a glance."
  },
  {
    icon: Users,
    eyebrow: "Members",
    title: "Keep every tenant organized",
    description: "Track member details, plan assignments, and follow up without the mental clutter."
  },
  {
    icon: BarChart3,
    eyebrow: "Insight",
    title: "Watch business performance",
    description: "Use reports and expenses to understand the health of your rental business."
  }
] as const;

export function IntroScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.icon;

  const dots = useMemo(() => slides.map((_, slideIndex) => slideIndex === index), [index]);

  const next = () => {
    if (isLast) {
      navigation.replace("AccountSetup");
      return;
    }
    setIndex((current) => Math.min(current + 1, slides.length - 1));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>RentTrack</Text>
          <Text style={styles.step}>Step {index + 1} of {slides.length}</Text>
        </View>

        <Card style={styles.hero}>
          <View style={styles.iconWrap}>
            <Icon color={colors.brand[700]} size={32} />
          </View>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </Card>

        <View style={styles.dots}>
          {dots.map((active, dotIndex) => (
            <Pressable
              key={dotIndex}
              accessibilityRole="button"
              onPress={() => setIndex(dotIndex)}
              style={[styles.dot, active && styles.dotActive]}
            />
          ))}
        </View>
      </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerButton}>
          <Button variant="secondary" fullWidth onPress={() => navigation.replace("AccountSetup")}>
            Skip
          </Button>
        </View>
        <View style={styles.footerButton}>
          <Button fullWidth onPress={next}>
            Next
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    justifyContent: "center",
    gap: spacing[5]
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink[900] },
  step: { ...typography.caption, color: colors.ink[500] },
  hero: { alignItems: "center", gap: spacing[3], paddingVertical: spacing[6] },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: "center",
    justifyContent: "center"
  },
  eyebrow: { ...typography.caption, color: colors.brand[700], textTransform: "uppercase" },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", color: colors.ink[900], textAlign: "center" },
  description: { ...typography.body, color: colors.ink[600], textAlign: "center", maxWidth: 300 },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing[2] },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface.line
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.brand[600]
  },
  footer: {
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.surface.line,
    backgroundColor: colors.surface.app
  },
  footerButton: { flex: 1 }
});
