import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Plus, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MemberRow } from "../components/MemberRow";
import { useMembers } from "../data/MembersContext";
import { colors, radii, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

export function MembersScreen() {
  const [query, setQuery] = useState(""); const { members } = useMembers(); const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const filtered = useMemo(() => members.filter((m) => `${m.name} ${m.business} ${m.unit}`.toLowerCase().includes(query.toLowerCase())), [members, query]);
  return <View style={styles.screen}>
    <View style={styles.toolbar}><View style={styles.search}><Search size={19} color={colors.ink[500]} /><TextInput value={query} onChangeText={setQuery} placeholder="Search name, business, or unit" placeholderTextColor={colors.ink[300]} style={styles.input} /></View><Pressable accessibilityLabel="Add member" onPress={() => navigation.navigate("AddMember")} style={styles.add}><Plus color={colors.white} size={23} /></Pressable></View>
    <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? "member" : "members"}</Text>
    <ScrollView contentContainerStyle={styles.list}>{filtered.map((member) => <MemberRow key={member.id} member={member} onPress={() => navigation.navigate("MemberDetail", { memberId: member.id })} />)}{filtered.length === 0 && <Text style={styles.empty}>No members match your search.</Text>}</ScrollView>
  </View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, toolbar: { flexDirection: "row", padding: spacing[4], gap: spacing[3] }, search: { flex: 1, height: 48, flexDirection: "row", alignItems: "center", gap: spacing[2], paddingHorizontal: spacing[3], borderWidth: 1, borderColor: colors.surface.line, backgroundColor: colors.white, borderRadius: radii.md }, input: { flex: 1, fontSize: 15, color: colors.ink[900] }, add: { width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand[600], borderRadius: radii.md }, count: { ...typography.caption, color: colors.ink[500], paddingHorizontal: spacing[4], paddingBottom: spacing[3] }, list: { marginHorizontal: spacing[4], borderWidth: 1, borderColor: colors.surface.line, paddingBottom: spacing[8] }, empty: { ...typography.body, color: colors.ink[500], textAlign: "center", padding: spacing[8] } });
