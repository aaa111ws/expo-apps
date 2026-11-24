import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAVED = Array.of(
  { id: '1', label: 'Дом', addr: 'Москва, ул. Тверская, 12, кв. 45', icon: 'home' },
  { id: '2', label: 'Работа', addr: 'Москва, Пресненская наб., 8с1', icon: 'briefcase' },
  { id: '3', label: 'Спортзал', addr: 'Москва, ул. Арбат, 24', icon: 'barbell' }
);

export default function AddressModal({ visible, onClose, currentAddress, onSelect }) {
  const [custom, setCustom] = useState('');

  const applyCustom = () => {
    if (!custom.trim()) return;
    onSelect(custom.trim());
    setCustom('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>Адрес доставки</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              placeholder="Улица, дом, квартира..."
              placeholderTextColor="#8E8E93"
              value={custom}
              onChangeText={setCustom}
              onSubmitEditing={applyCustom}
            />
            <TouchableOpacity style={s.saveBtn} onPress={applyCustom}>
              <Ionicons name="checkmark" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={s.sub}>Сохраненные адреса</Text>
          {SAVED.map((item) => {
            const active = currentAddress === item.addr;
            return (
              <TouchableOpacity
                key={item.id}
                style={Array.of(s.item, active && s.itemActive)}
                onPress={() => {
                  onSelect(item.addr);
                  onClose();
                }}
              >
                <View style={s.iconBox}>
                  <Ionicons name={item.icon} size={18} color="#FF5A36" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.itemLabel}>{item.label}</Text>
                  <Text style={s.itemAddr}>{item.addr}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={22} color="#FF5A36" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1E1E2E' },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  input: { flex: 1, backgroundColor: '#F2F3F7', borderRadius: 14, paddingHorizontal: 14, height: 46, fontSize: 15, color: '#1E1E2E' },
  saveBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FF5A36', alignItems: 'center', justifyContent: 'center' },
  sub: { fontSize: 13, fontWeight: '700', color: '#8E8E93', marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: '#F6F7FB', marginBottom: 10, gap: 12 },
  itemActive: { backgroundColor: '#FFF0EC', borderWidth: 1, borderColor: '#FF5A36' },
  iconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 15, fontWeight: '700', color: '#1E1E2E' },
  itemAddr: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
});
