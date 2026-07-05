import type { ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { colors, radii, shadows, spacing } from "../../design";

type CardProps = ViewProps & {
  children: ReactNode;
  padded?: boolean;
};

export function Card({ children, padded = true, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderColor: colors.surface.line,
    borderRadius: radii.md,
    borderWidth: 1,
    ...shadows.card
  },
  padded: {
    padding: spacing[4]
  }
});
