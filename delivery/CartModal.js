import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartModal({ visible, onClose, items, onAdd, onRemove, onClear, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={mStyles.overlay}>
        <View style={mStyles.sheet}>
          <View style={mStyles.topRow}>
            <View>
              <Text style={mStyles.title}>Корзина ({count})</Text>
              {items.length > 0 && (
                <TouchableOpacity onPress={onClear}>
                  <Text style={mStyles.clearText}>Очистить корзину</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={mStyles.empty}>В корзине пока пусто</Text>}
            renderItem={({ item }) => (
              <View style={mStyles.row}>
                <Image source={{ uri: item.image }} style={mStyles.thumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={mStyles.rest}>{item.restaurant}</Text>
                  <Text style={mStyles.itemName}>{item.name}</Text>
                  <Text style={mStyles.meta}>{item.weight} • {item.price} ₽/шт</Text>
                  <Text style={mStyles.itemPrice}>{item.price * item.qty} ₽</Text>
                </View>
                <View style={mStyles.qtyBox}>
                  <TouchableOpacity style={mStyles.qBtn} onPress={() => onRemove(item.id)}>
                    <Ionicons name="remove" size={16} color="#1E1E2E" />
                  </TouchableOpacity>
                  <Text style={mStyles.qText}>{item.qty}</Text>
                  <TouchableOpacity style={mStyles.qBtn} onPress={() => onAdd(item)}>
                    <Ionicons name="add" size={16} color="#1E1E2E" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {items.length > 0 && (
            <View style={mStyles.footer}>
              <View style={mStyles.totalRow}>
                <Text style={mStyles.totalLabel}>Итого (доставка 0 ₽)</Text>
                <Text style={mStyles.totalSum}>{total} ₽</Text>
              </View>
              <TouchableOpacity style={mStyles.orderBtn} onPress={onCheckout}>
                <Text style={mStyles.orderBtnText}>Перейти к оплате</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const mStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: '85%' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: '#1E1E2E' },
  clearText: { fontSize: 13, color: '#FF5A36', fontWeight: '600', marginTop: 2 },
  empty: { textAlign: 'center', color: '#8E8E93', marginVertical: 50, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F2F3F7' },
  thumb: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#F2F3F7' },
  rest: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1E1E2E' },
  meta: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#FF5A36', marginTop: 4 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3F7', borderRadius: 12, padding: 4, gap: 10 },
  qBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  qText: { fontWeight: '700', fontSize: 15, color: '#1E1E2E' },
  footer: { marginTop: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 14, color: '#00B894', fontWeight: '600' },
  totalSum: { fontSize: 22, fontWeight: '800', color: '#1E1E2E' },
  orderBtn: { backgroundColor: '#FF5A36', borderRadius: 16, height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  orderBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
