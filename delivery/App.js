import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, DISHES } from './mockData';
import { styles } from './styles';
import CartModal from './CartModal';
import AddressModal from './AddressModal';
import ProfileModal from './ProfileModal';
import CheckoutModal from './CheckoutModal';

export default function App() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(Array.of());

  const [address, setAddress] = useState('Москва, ул. Тверская, 12, кв. 45');
  const [user, setUser] = useState({ name: 'Алексей Смирнов', phone: '+7 (999) 123-45-67' });
  const [orders, setOrders] = useState(Array.of());

  const [cartOpen, setCartOpen] = useState(false);
  const [addrOpen, setAddrOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const addItem = (dish) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === dish.id);
      if (found) return prev.map((i) => (i.id === dish.id ? { ...i, qty: i.qty + 1 } : i));
      return prev.concat({ ...dish, qty: 1 });
    });
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0)
    );
  };

  const handleOrderSuccess = (orderData) => {
    const newOrder = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('ru-RU'),
      ...orderData,
    };
    setOrders((prev) => Array.of(newOrder, ...prev));
    setCart(Array.of());
    setPayOpen(false);
  };

  const getQty = (id) => cart.find((i) => i.id === id)?.qty || 0;
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  const totalSum = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filteredDishes = DISHES.filter((d) => {
    const matchCat = category === 'all' || d.category === category;
    const matchText =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.addressRow}>
          <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => setAddrOpen(true)}>
            <Text style={styles.addressLabel}>Адрес доставки ▾</Text>
            <Text style={styles.addressValue} numberOfLines={1}>{address}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setProfOpen(true)}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF0EC', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="person" size={20} color="#FF5A36" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Блюда или рестораны..."
            placeholderTextColor="#8E8E93"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={Array.of(styles.catChip, active && styles.catChipActive)}
                onPress={() => setCategory(c.id)}
              >
                <Ionicons name={c.icon} size={15} color={active ? '#FFF' : '#FF5A36'} />
                <Text style={Array.of(styles.catText, active && styles.catTextActive)}>{c.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const qty = getQty(item.id);
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Ionicons name="time-outline" size={13} color="#FF5A36" />
                  <Text style={styles.badgeText}>{item.time}</Text>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="star" size={13} color="#FFB800" />
                  <Text style={styles.badgeText}>{item.rating}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.restName}>{item.restaurant}</Text>
                <Text style={styles.dishName}>{item.name}</Text>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.price}>{item.price} ₽</Text>
                    <Text style={styles.weight}>{item.weight}</Text>
                  </View>

                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={() => addItem(item)}>
                      <Text style={styles.addBtnText}>+ В корзину</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.counterBox}>
                      <TouchableOpacity style={styles.counterBtn} onPress={() => removeItem(item.id)}>
                        <Ionicons name="remove" size={16} color="#FFF" />
                      </TouchableOpacity>
                      <Text style={styles.counterVal}>{qty}</Text>
                      <TouchableOpacity style={styles.counterBtn} onPress={() => addItem(item)}>
                        <Ionicons name="add" size={16} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {totalCount > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => setCartOpen(true)}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{totalCount}</Text>
            </View>
            <Text style={styles.cartBarTitle}>Открыть корзину</Text>
          </View>
          <Text style={styles.cartBarTotal}>{totalSum} ₽</Text>
        </TouchableOpacity>
      )}

      <CartModal
        visible={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onAdd={addItem}
        onRemove={removeItem}
        onClear={() => setCart(Array.of())}
        onCheckout={() => {
          setCartOpen(false);
          setPayOpen(true);
        }}
      />

      <CheckoutModal
        visible={payOpen}
        onClose={() => setPayOpen(false)}
        items={cart}
        address={address}
        onSuccess={handleOrderSuccess}
      />

      <AddressModal
        visible={addrOpen}
        onClose={() => setAddrOpen(false)}
        currentAddress={address}
        onSelect={setAddress}
      />

      <ProfileModal
        visible={profOpen}
        onClose={() => setProfOpen(false)}
        user={user}
        onUpdateUser={setUser}
        orders={orders}
      />
    </View>
  );
}
