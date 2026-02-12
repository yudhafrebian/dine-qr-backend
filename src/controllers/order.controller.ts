import { NextFunction, Request, Response } from "express";
import { OrderServices } from "../services/order.service";
import ApiResponse from "../utils/Response";
import { OrderRepository } from "../repositories/order.repository";
import { TransactionLogRepository } from "../repositories/transaction-log.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { SubscriptionService } from "../services/subscription.service";

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

  async handleMidtransWebhook(req: Request, res: Response) {
    try {
      const response = new ApiResponse(res);
      const statusResponse = req.body;

      if (!statusResponse || !statusResponse.order_id) {
        return res.status(400).json({ message: "Invalid payload" });
      }

      const midtransOrderId = statusResponse.order_id;
      const midtransPaymentType= statusResponse.metadata.payment_type;
      const transactionStatus = statusResponse.transaction_status;
      const isSubscription = midtransPaymentType === "SUBSCRIPTION";

      if (isSubscription) {
        if (
          transactionStatus === "capture" ||
          transactionStatus === "settlement"
        ) {
          const { restaurantId, planId } = statusResponse.metadata;

          await SubscriptionService.activateSubscription({
            restaurantId: Number(restaurantId),
            planId: Number(planId),
            midtransTransactionId: statusResponse.transaction_id,
          });
          

          console.log(`Subscription Activated for Restaurant ${restaurantId}`);
        }
        return response.success(200, "Subscription Processed");
      }

      const order = await OrderRepository.findByOrderNumber(midtransOrderId);

      if (!order) {
        console.log(`Order ${midtransOrderId} tidak ditemukan.`);
        return res.status(404).json({ message: "Order not found" });
      }

      if (
        transactionStatus === "capture" ||
        transactionStatus === "settlement"
      ) {
        await OrderRepository.updatePaymentStatus(order.id, "PAID");
        await OrderRepository.updateOrderStatus(order.id, "PENDING");

        await PaymentRepository.createPayment({
          orderId: order.id, // Di sini orderId aman karena jalur Order
          amount: Number(statusResponse.gross_amount),
          method: statusResponse.payment_type,
          transactionId: statusResponse.transaction_id,
        });

        await TransactionLogRepository.create(
          order.id,
          "Payment Success",
          `Payment for ${statusResponse.payment_type} success`,
          statusResponse,
        );
      }

      return response.success(200, "Order Payment Processed");
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default OrderController;
