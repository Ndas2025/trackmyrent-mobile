import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors, radii, spacing, typography } from "../../design";

type TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
  errorText?: string;
};

export function TextField({ label, helperText, errorText, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.ink[300]}
        style={[styles.input, errorText && styles.inputError, style]}
        {...props}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {!errorText && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2]
  },
  label: {
    ...typography.label,
    color: colors.ink[700]
  },
  input: {
    minHeight: 48,
    borderColor: colors.surface.line,
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: colors.white,
    color: colors.ink[900],
    fontSize: 15,
    paddingHorizontal: spacing[4]
  },
  inputError: {
    borderColor: colors.status.unpaid
  },
  helper: {
    ...typography.caption,
    color: colors.ink[500]
  },
  error: {
    ...typography.caption,
    color: colors.status.unpaid
  }
});
