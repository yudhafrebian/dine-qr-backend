import { snap } from "../config/midtrans";
import { prisma } from "../config/prisma";
import { OrderRepository } from "../repositories/order.repository";
import { ApiError } from "../utils/ApiError";

export const OrderServices = {
  createOrder: async (payload: { 
    restaurantId: number, 
    tableId: number, 
    items: { menuItemId: number, qty: number }[],
    paymentMethod: "CASH" | "QRIS"
  }) => {
    return await prisma.$transaction(async (tx) => {
      
      // 1. Validasi Menu dan Harga (Anti-Cheat)
      const menuIds = payload.items.map(i => i.menuItemId);
      const menus = await tx.menuItem.findMany({
        where: { id: { in: menuIds }, restaurantId: payload.restaurantId }
      });

      let totalAmount = 0;
      const orderItemsData = payload.items.map(item => {
        const menu = menus.find(m => m.id === item.menuItemId);
        if (!menu) throw new ApiError(404, `Menu ID ${item.menuItemId} tidak ditemukan`);
        
        totalAmount += menu.price * item.qty;
        return {
          menuItemId: item.menuItemId,
          qty: item.qty,
          price: menu.price // Snapshot harga
        };
      });

      // 2. Buat Order di DB (Nested Create)
      const orderNumber = `QRV-${Date.now()}`;
      const newOrder = await OrderRepository.create({
        orderNumber,
        restaurantId: payload.restaurantId,
        tableId: payload.tableId,
        paymentMethod: payload.paymentMethod,
        paymentStatus: "UNPAID",
        orderStatus: "PENDING",
        totalPrice: totalAmount,
        OrderItem: {
          create: orderItemsData
        }
      }, tx);

      // 3. Jika QRIS, minta token Midtrans
      if (payload.paymentMethod === "QRIS") {
        const parameter = {
          transaction_details: {
            order_id: orderNumber, // Harus unik
            gross_amount: totalAmount
          },
          usage_limit: 1 // Opsional
        };

        const transaction = await snap.createTransaction(parameter);
        
        return {
          order: newOrder,
          paymentUrl: transaction.redirect_url,
          snapToken: transaction.token
        };
      }

      // 4. Jika CASH, langsung kembalikan data order
      return { order: newOrder };
    });
  }
};