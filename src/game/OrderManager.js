/**
 * KANA - Tamil Nadu Idly Kadai
 * Order Manager - Order Lifecycle, Queue State, and Patience Tracking
 */

import { DISHES } from './GameConfig.js';
import { audio } from './AudioManager.js';

let orderCounter = 100;

export class OrderManager {
  constructor(economyManager) {
    this.economy = economyManager;
    this.orders = [];
  }

  reset() {
    this.orders = [];
    orderCounter = 100;
  }

  createOrder(customer, dishId, initialPatience = 45) {
    const dishDef = DISHES[dishId];
    if (!dishDef) return null;

    orderCounter++;
    const order = {
      id: orderCounter,
      customerId: customer.id,
      dishId: dishDef.id,
      dishName: dishDef.name,
      tamilName: dishDef.tamilName,
      price: dishDef.price,
      status: 'ORDERED', // ORDERED -> WAITING_FOR_COOK -> OUT_FOR_DELIVERY -> SERVED -> PAID
      totalPatience: initialPatience,
      patienceRemaining: initialPatience,
      createdTime: Date.now(),
      quality: null
    };

    this.orders.push(order);
    audio.playOrderTicket();
    return order;
  }

  update(dt, onOrderExpired) {
    for (let i = this.orders.length - 1; i >= 0; i--) {
      const order = this.orders[i];

      // Decrease patience while waiting for delivery
      if (order.status !== 'SERVED' && order.status !== 'PAID' && order.status !== 'CANCELLED') {
        order.patienceRemaining -= dt;

        if (order.patienceRemaining <= 0) {
          order.status = 'CANCELLED';
          order.patienceRemaining = 0;
          this.economy.recordCancelledOrder(order);
          audio.playCustomerAngry();
          if (onOrderExpired) {
            onOrderExpired(order);
          }
        }
      }
    }
  }

  getOrderByCustomerId(customerId) {
    return this.orders.find(o => o.customerId === customerId && o.status !== 'PAID' && o.status !== 'CANCELLED');
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  getActiveOrders() {
    return this.orders.filter(o => o.status !== 'PAID' && o.status !== 'CANCELLED');
  }

  removeOrder(orderId) {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      this.orders.splice(idx, 1);
    }
  }

  markDelivering(orderId) {
    const order = this.getOrderById(orderId);
    if (order && order.status !== 'CANCELLED') {
      order.status = 'OUT_FOR_DELIVERY';
    }
  }

  markServed(orderId, quality) {
    const order = this.getOrderById(orderId);
    if (order && order.status !== 'CANCELLED') {
      order.status = 'SERVED';
      order.quality = quality;
    }
  }

  markPaid(orderId) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = 'PAID';
    }
  }
}
