export const colors = {
  brand: {
    50: "#eefbf7",
    100: "#d7f4ec",
    500: "#17a984",
    600: "#0b876b",
    700: "#086c57"
  },
  accent: {
    blue: "#2563eb",
    violet: "#7c3aed",
    amber: "#d97706"
  },
  ink: {
    900: "#10231f",
    800: "#18342e",
    700: "#29463f",
    600: "#49645d",
    500: "#687f78",
    300: "#a9bab5"
  },
  surface: {
    app: "#f6f8f7",
    card: "#ffffff",
    soft: "#edf4f1",
    line: "#dce7e3"
  },
  status: {
    paid: "#15803d",
    paidSoft: "#dcfce7",
    unpaid: "#dc2626",
    unpaidSoft: "#fee2e2",
    frozen: "#0284c7",
    frozenSoft: "#e0f2fe",
    pending: "#d97706",
    pendingSoft: "#fef3c7",
    neutral: "#49645d",
    neutralSoft: "#edf4f1"
  },
  white: "#ffffff",
  black: "#000000"
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40
} as const;

export const radii = {
  sm: 6,
  md: 8,
  pill: 999
} as const;

export const typography = {
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800" as const
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700" as const
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const
  }
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  }
} as const;
