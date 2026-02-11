import { NextFunction, Request, Response } from "express";
import { OrderServices } from "../services/order.service";
import ApiResponse from "../utils/Response";
import { OrderRepository } from "../repositories/order.repository";
import { TransactionLogRepository } from "../repositories/transaction-log.repository";

class OrderController {
  async CreateOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);

      const { restaurantId } = req.params;

      const { tableId, items, paymentMethod } = req.body;

      if (!items || items.length === 0) {
        response.error(400, "Keranjang belanja tidak boleh kosong");
        return;
      }

      const orderData = await OrderServices.createOrder({
        restaurantId: Number(restaurantId),
        tableId,
        items,
        paymentMethod,
      });

      response.success(201, "Pesanan berhasil dibuat", orderData);
    } catch (error) {
      console.error("Error at CreateOrder Controller:", error);
      next(error);
    }
  }

  // Di Order.controller.ts atau khusus WebhookController
  async handleMidtransWebhook(req: Request, res: Response) {
    const response = new ApiResponse(res);
    const statusResponse = req.body; // Data dari Midtrans

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "challenge") {
        // Opsional: handle fraud
      } else {
        // PEMBAYARAN SUKSES
        await OrderRepository.updatePaymentStatus(orderId, "PAID");

        // Buat log transaksi
        await TransactionLogRepository.create(
          orderId,
          "PAYMENT_SUCCESS",
          `Pembayaran ${statusResponse.payment_type} sukses`,
          statusResponse,
        );

        await OrderRepository.updateOrderStatus(orderId, "PENDING");
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      // Handle pesanan gagal/kadaluarsa
    }

    response.success(200, "Webhook diterima");
  }
}

export default OrderController;
