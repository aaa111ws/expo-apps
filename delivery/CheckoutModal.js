import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const METHODS = Array.of(
  { id: 'card', label: 'Картой онлайн •••• 4582', icon: 'card' },
  { id: 'sbp', label: 'Система быстрых платежей (СБП)', icon: 'qr-code' },
  { id: 'cash', label: 'Наличными курьеру', icon: 'cash' }
);

const TIPS = Array.of(0, 50, 100, 200);

export default function CheckoutModal({ visible, onClose, items, address, onSuccess }) {
  const [method, setMethod] = useState('card');
  const [tip, setTip] = useState(50);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [comment, setComment] = useState('');
  const [paid, setPaid] = useState(false);

  const subTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const finalTotal = Math.max(0, subTotal - discount + tip);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'FOOD200') {
      setDiscount(200);
    } else {
      setDiscount(0);
    }
  };

  const payOrder = () => {
    setPaid(true);
    const methodLabel = METHODS.find((m) => m.id === method)?.label || 'Картой';
    const summary = items.map((i) => `${i.name} ×${i.qty}`).join(', ');
    setTimeout(() => {
      setPaid(false);
      setDiscount(0);
      setPromo('');
      onSuccess({ total: finalTotal, method: methodLabel, summary });
    }, 1800);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={s.container}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={onClose} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1E1E2E" />
          </TouchableOpacity>
          <Text style={s.title}>Оформление и оплата</Text>
          <View style={{ width: 32 }} />
        </View>

        {paid ? (
          <View style={s.successBox}>
            <Ionicons name="checkmark-circle" size={80} color="#00B894" />
            <Text style={s.successTitle}>Оплата прошла успешно!</Text>
            <Text style={s.successSub}>Заказ передан на кухню. Ожидайте курьера через 30 минут.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={s.body}>
            <View style={s.card}>
              <Text style={s.cardTitle}>Куда доставить</Text>
              <View style={s.addrRow}>
                <Ionicons name="location" size={20} color="#FF5A36" />
                <Text style={s.addrText}>{address}</Text>
              </View>
              <TextInput
                style={s.input}
                placeholder="Комментарий курьеру (код домофона, этаж)..."
                placeholderTextColor="#8E8E93"
                value={comment}
                onChangeText={setComment}
              />
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Способ оплаты</Text>
              {METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={Array.of(s.methodRow, active && s.methodActive)}
                    onPress={() => setMethod(m.id)}
                  >
                    <Ionicons name={m.icon} size={20} color={active ? '#FF5A36' : '#8E8E93'} />
                    <Text style={s.methodText}>{m.label}</Text>
                    <Ionicons
                      name={active ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={active ? '#FF5A36' : '#C7C7CC'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Чаевые курьеру</Text>
              <View style={s.tipsRow}>
                {TIPS.map((tVal) => (
                  <TouchableOpacity
                    key={tVal}
                    style={Array.of(s.tipChip, tip === tVal && s.tipActive)}
                    onPress={() => setTip(tVal)}
                  >
                    <Text style={Array.of(s.tipText, tip === tVal && s.tipTextActive)}>
                      {tVal === 0 ? 'Без чаевых' : `${tVal} ₽`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[s.cardTitle, { marginTop: 14 }]}>Промокод (попробуйте FOOD200)</Text>
              <View style={s.promoRow}>
                <TextInput
                  style={[s.input, { flex: 1, marginTop: 0 }]}
                  placeholder="Введите промокод"
                  placeholderTextColor="#8E8E93"
                  value={promo}
                  onChangeText={setPromo}
                />
                <TouchableOpacity style={s.promoBtn} onPress={applyPromo}>
                  <Text style={s.promoBtnText}>Применить</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.card}>
              <View style={s.sumRow}>
                <Text style={s.sumLabel}>Блюда ({items.reduce((a, b) => a + b.qty, 0)})</Text>
                <Text style={s.sumVal}>{subTotal} ₽</Text>
              </View>
              <View style={s.sumRow}>
                <Text style={s.sumLabel}>Доставка</Text>
                <Text style={[s.sumVal, { color: '#00B894' }]}>Бесплатно</Text>
              </View>
              {discount > 0 && (
                <View style={s.sumRow}>
                  <Text style={s.sumLabel}>Скидка по промокоду</Text>
                  <Text style={[s.sumVal, { color: '#FF5A36' }]}>-{discount} ₽</Text>
                </View>
              )}
              {tip > 0 && (
                <View style={s.sumRow}>
                  <Text style={s.sumLabel}>Чаевые</Text>
                  <Text style={s.sumVal}>{tip} ₽</Text>
                </View>
              )}
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>Итого к оплате</Text>
                <Text style={s.totalVal}>{finalTotal} ₽</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {!paid && (
          <View style={s.footer}>
            <TouchableOpacity style={s.payBtn} onPress={payOrder}>
              <Text style={s.payBtnText}>Оплатить {finalTotal} ₽</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB', paddingTop: 48 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 19, fontWeight: '800', color: '#1E1E2E' },
  body: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E1E2E', marginBottom: 10 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addrText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E1E2E' },
  input: { backgroundColor: '#F2F3F7', borderRadius: 12, paddingHorizontal: 12, height: 42, marginTop: 10, fontSize: 14, color: '#1E1E2E' },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: '#F6F7FB', marginBottom: 8, gap: 10 },
  methodActive: { backgroundColor: '#FFF0EC', borderWidth: 1, borderColor: '#FF5A36' },
  methodText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E1E2E' },
  tipsRow: { flexDirection: 'row', gap: 8 },
  tipChip: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F2F3F7', alignItems: 'center' },
  tipActive: { backgroundColor: '#FF5A36' },
  tipText: { fontSize: 12, fontWeight: '700', color: '#1E1E2E' },
  tipTextActive: { color: '#FFF' },
  promoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  promoBtn: { backgroundColor: '#1E1E2E', borderRadius: 12, paddingHorizontal: 14, height: 42, justifyContent: 'center' },
  promoBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sumLabel: { fontSize: 14, color: '#8E8E93' },
  sumVal: { fontSize: 14, fontWeight: '700', color: '#1E1E2E' },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F2F3F7', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1E1E2E' },
  totalVal: { fontSize: 20, fontWeight: '800', color: '#FF5A36' },
  footer: { padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EFEFEF' },
  payBtn: { backgroundColor: '#FF5A36', borderRadius: 16, height: 54, alignItems: 'center', justifyContent: 'center' },
  payBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1E1E2E', marginTop: 16 },
  successSub: { fontSize: 15, color: '#8E8E93', textAlign: 'center', marginTop: 8 },
});
