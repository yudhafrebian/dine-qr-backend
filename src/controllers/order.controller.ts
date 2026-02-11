import { NextFunction, Request, Response } from "express";
import { OrderServices } from "../services/order.service";
import ApiResponse from "../utils/Response";
import { OrderRepository } from "../repositories/order.repository";
import { TransactionLogRepository } from "../repositories/transaction-log.repository";
import { PaymentRepository } from "../repositories/payment.repository";

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
        const respone = new ApiResponse(res)
        const statusResponse = req.body;

        if (!statusResponse || !statusResponse.order_id) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        const orderNumber = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;

        const order = await OrderRepository.findByOrderNumber(orderNumber);

        if (!order) {
            console.log(`Order ${orderNumber} tidak ditemukan di database.`);
            return res.status(404).json({ message: "Order not found" });
        }

        if (transactionStatus === "capture" || transactionStatus === "settlement") {
            await OrderRepository.updatePaymentStatus(order.id, "PAID");
            await OrderRepository.updateOrderStatus(order.id, "PENDING");

            await PaymentRepository.createPayment({
              orderId: order.id,
              amount: Number(statusResponse.gross_amount),
              method: statusResponse.payment_type,
              transactionId: statusResponse.transaction_id
            })

            await TransactionLogRepository.create(
              order.id,
              "Payment Success",
              `Payment for ${statusResponse.payment_type} success`,
              statusResponse
            )
            
            
            console.log(`Payment Success for ${statusResponse.order_id}`)
        }
        respone.success(200, "Payment Success")
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
}

export default OrderController;
