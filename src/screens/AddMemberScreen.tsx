import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, TextField } from "../components/ui";
import { useMembers } from "../data/MembersContext";
import { colors, spacing, typography } from "../design";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddMember">;
export function AddMemberScreen({ navigation }: Props) {
  const { addMember } = useMembers();
  const [form, setForm] = useState({ name: "", business: "", phone: "", unit: "", rent: "", dueDay: "5" });
  const [submitted, setSubmitted] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const valid = form.name.trim() && form.business.trim() && form.phone.trim() && form.unit.trim() && Number(form.rent) > 0 && Number(form.dueDay) >= 1 && Number(form.dueDay) <= 31;
  const save = () => { setSubmitted(true); if (!valid) return; const member = addMember({ name: form.name.trim(), business: form.business.trim(), phone: form.phone.trim(), unit: form.unit.trim(), monthlyRent: Number(form.rent), dueDay: Number(form.dueDay) }); navigation.replace("MemberDetail", { memberId: member.id }); };
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View><Text style={styles.title}>New rental member</Text><Text style={styles.subtitle}>Add the tenant and terms for this rental unit.</Text></View>
    <Card style={styles.form}>
      <Text style={styles.section}>Member details</Text>
      <TextField label="Full name" value={form.name} onChangeText={set("name")} placeholder="e.g. Priya Sharma" errorText={submitted && !form.name.trim() ? "Full name is required" : undefined} />
      <TextField label="Business name" value={form.business} onChangeText={set("business")} placeholder="e.g. Priya Stores" errorText={submitted && !form.business.trim() ? "Business name is required" : undefined} />
      <TextField label="Phone number" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" placeholder="+91 98765 43210" errorText={submitted && !form.phone.trim() ? "Phone number is required" : undefined} />
    </Card>
    <Card style={styles.form}><Text style={styles.section}>Rental details</Text><TextField label="Unit / shop" value={form.unit} onChangeText={set("unit")} placeholder="e.g. Shop 12" errorText={submitted && !form.unit.trim() ? "Unit is required" : undefined} /><TextField label="Monthly rent" value={form.rent} onChangeText={set("rent")} keyboardType="numeric" placeholder="₹ 0" errorText={submitted && !(Number(form.rent) > 0) ? "Enter a valid rent amount" : undefined} /><TextField label="Payment due day" value={form.dueDay} onChangeText={set("dueDay")} keyboardType="number-pad" helperText="Day of each month, from 1 to 31" errorText={submitted && !(Number(form.dueDay) >= 1 && Number(form.dueDay) <= 31) ? "Enter a day from 1 to 31" : undefined} /></Card>
    <Button fullWidth onPress={save}>Save member</Button>
  </ScrollView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.surface.app }, content: { padding: spacing[4], gap: spacing[4], paddingBottom: spacing[10] }, title: { ...typography.title, color: colors.ink[900] }, subtitle: { ...typography.body, color: colors.ink[600] }, form: { gap: spacing[4] }, section: { ...typography.sectionTitle, color: colors.ink[900] } });
