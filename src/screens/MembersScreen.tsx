import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Plus, Search, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MemberRow } from "../components/MemberRow";
import { Card, SummaryCard } from "../components/ui";
import { useMembers } from "../data/MembersContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

const filters = ["All", "Paid", "Pending", "Overdue"] as const;

export function MembersScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const { members } = useMembers();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch = `${member.name} ${member.business} ${member.unit}`.toLowerCase().includes(searchTerm);
      const matchesFilter = filter === "All" ? true : member.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [members, query, filter]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>MEMBER DIRECTORY</Text>
            <Text style={styles.title}>Members</Text>
            <Text style={styles.subtitle}>Search the tenant list, filter by payment state, and open a profile in one tap.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Add member" onPress={() => navigation.navigate("AddMember")} style={styles.add}>
            <Plus color={colors.white} size={23} />
          </Pressable>
        </View>

        <View style={styles.search}>
          <Search size={19} color={colors.ink[500]} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, business, or unit"
            placeholderTextColor={colors.ink[300]}
            style={styles.input}
          />
        </View>

        <View style={styles.filters}>
          {filters.map((item) => (
            <FilterChip key={item} active={item === filter} label={item} onPress={() => setFilter(item)} />
          ))}
        </View>
      </Card>

      <View style={styles.grid}>
        <SummaryCard label="All members" value={`${members.length}`} detail="Active profiles" />
        <SummaryCard label="Paid" value={`${members.filter((member) => member.status === "Paid").length}`} detail="Closed this cycle" accent="brand" />
        <SummaryCard label="Needs attention" value={`${members.filter((member) => member.status !== "Paid").length}`} detail="Pending or overdue" accent="red" />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? "member" : "members"}</Text>
        <View style={styles.listBadge}>
          <Users size={16} color={colors.brand[700]} />
          <Text style={styles.listBadgeText}>Directory</Text>
        </View>
      </View>

      <View style={styles.list}>
        {filtered.map((member) => (
          <MemberRow key={member.id} member={member} onPress={() => navigation.navigate("MemberDetail", { memberId: member.id })} />
        ))}
        {filtered.length === 0 && <Text style={styles.empty}>No members match your search.</Text>}
      </View>
    </ScrollView>
  );
}

function FilterChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: spacing[4], gap: spacing[4], paddingBottom: 128 },
  hero: { gap: spacing[4] },
  heroTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  heroText: { flex: 1, gap: spacing[2] },
  eyebrow: { ...typography.caption, color: colors.brand[700] },
  title: { ...typography.title, color: colors.ink[900] },
  subtitle: { ...typography.body, color: colors.ink[600] },
  add: { width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[600], borderRadius: radii.md },
  search: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: spacing[2], paddingHorizontal: spacing[3], borderWidth: 1, borderColor: colors.surface.line, backgroundColor: colors.white, borderRadius: radii.md },
  input: { flex: 1, fontSize: 15, color: colors.ink[900] },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  chip: { minHeight: 34, paddingHorizontal: spacing[3], borderRadius: radii.pill, borderWidth: 1, borderColor: colors.surface.line, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  chipActive: { backgroundColor: colors.brand[50], borderColor: colors.brand[100] },
  chipPressed: { opacity: 0.8 },
  chipLabel: { ...typography.caption, color: colors.ink[600] },
  chipLabelActive: { color: colors.brand[700] },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  count: { ...typography.caption, color: colors.ink[500] },
  listBadge: { flexDirection: "row", alignItems: "center", gap: spacing[2], paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radii.pill, backgroundColor: colors.brand[50] },
  listBadgeText: { ...typography.caption, color: colors.brand[700] },
  list: { borderWidth: 1, borderColor: colors.surface.line, overflow: "hidden" },
  empty: { ...typography.body, color: colors.ink[500], textAlign: "center", padding: spacing[8] }
});
