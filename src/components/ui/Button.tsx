import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle
} from "react-native";
import { colors, radii, spacing, typography } from "../../design";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.brand[700]} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    borderWidth: 1
  },
  sm: {
    minHeight: 36,
    paddingHorizontal: spacing[3]
  },
  md: {
    minHeight: 48,
    paddingHorizontal: spacing[4]
  },
  fullWidth: {
    width: "100%"
  },
  primary: {
    backgroundColor: colors.brand[600],
    borderColor: colors.brand[600]
  },
  secondary: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[100]
  },
  danger: {
    backgroundColor: colors.status.unpaidSoft,
    borderColor: colors.status.unpaidSoft
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.surface.line
  },
  pressed: {
    opacity: 0.76
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    ...typography.label
  },
  primaryLabel: {
    color: colors.white
  },
  secondaryLabel: {
    color: colors.brand[700]
  },
  dangerLabel: {
    color: colors.status.unpaid
  },
  ghostLabel: {
    color: colors.ink[700]
  }
});
