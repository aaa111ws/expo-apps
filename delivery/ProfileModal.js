import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileModal({ visible, onClose, user, onUpdateUser, orders }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const save = () => {
    onUpdateUser({ name: name.trim() || user.name, phone: phone.trim() || user.phone });
    setEditing(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={s.container}>
        <View style={s.topBar}>
          <Text style={s.title}>Профиль</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.body}>
          <View style={s.profileCard}>
            <View style={s.avatar}>
              <Ionicons name="person" size={34} color="#FF5A36" />
            </View>
            {editing ? (
              <View style={{ flex: 1, gap: 8 }}>
                <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Ваше имя" />
                <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="Телефон" keyboardType="phone-pad" />
                <TouchableOpacity style={s.saveBtn} onPress={save}>
                  <Text style={s.saveBtnText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{user.name}</Text>
                <Text style={s.userPhone}>{user.phone}</Text>
              </View>
            )}
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)} style={s.editBtn}>
                <Ionicons name="create-outline" size={22} color="#FF5A36" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={s.sectionTitle}>История заказов ({orders.length})</Text>
          {orders.length === 0 ? (
            <View style={s.emptyBox}>
              <Ionicons name="receipt-outline" size={40} color="#C7C7CC" />
              <Text style={s.emptyText}>У вас пока нет завершенных заказов</Text>
            </View>
          ) : (
            orders.map((ord) => (
              <View key={ord.id} style={s.orderCard}>
                <View style={s.orderTop}>
                  <Text style={s.orderDate}>{ord.date}</Text>
                  <View style={s.statusBadge}>
                    <Text style={s.statusText}>Доставлен</Text>
                  </View>
                </View>
                <Text style={s.orderItems}>{ord.summary}</Text>
                <View style={s.orderBottom}>
                  <Text style={s.orderMethod}>{ord.method}</Text>
                  <Text style={s.orderTotal}>{ord.total} ₽</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB', paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E1E2E' },
  body: { padding: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 22, padding: 16, gap: 14, marginBottom: 24 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFF0EC', alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 18, fontWeight: '800', color: '#1E1E2E' },
  userPhone: { fontSize: 14, color: '#8E8E93', marginTop: 3 },
  editBtn: { padding: 8, backgroundColor: '#F6F7FB', borderRadius: 12 },
  input: { backgroundColor: '#F2F3F7', borderRadius: 10, paddingHorizontal: 10, height: 38, fontSize: 14 },
  saveBtn: { backgroundColor: '#FF5A36', borderRadius: 10, height: 36, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E1E2E', marginBottom: 12 },
  emptyBox: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#FFF', borderRadius: 20 },
  emptyText: { color: '#8E8E93', marginTop: 8, fontSize: 14 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, marginBottom: 12 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderDate: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  statusBadge: { backgroundColor: '#E6F9F3', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#00B894', fontSize: 11, fontWeight: '700' },
  orderItems: { fontSize: 14, color: '#1E1E2E', fontWeight: '600', marginBottom: 10 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F2F3F7', paddingTop: 8 },
  orderMethod: { fontSize: 12, color: '#8E8E93' },
  orderTotal: { fontSize: 16, fontWeight: '800', color: '#FF5A36' },
});
