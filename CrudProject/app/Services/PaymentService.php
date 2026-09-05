<?php

namespace App\Services;

class PaymentService
{
    protected $api;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        // 1. You usually store these keys in your .env file
        $keyId = env('RAZORPAY_KEY');
        $keySecret = env('RAZORPAY_SECRET');

        // 2. Initialize the Razorpay API object
        // NOTE: You must run `composer require razorpay/razorpay` in your terminal first!
        if ($keyId && $keySecret) {
            $this->api = new \Razorpay\Api\Api($keyId, $keySecret);
        }
    }

    /**
     * Step 1: Create an Order
     * This is called BEFORE showing the Razorpay popup on the frontend.
     */
    public function createOrder($amountInRupees, $receiptId)
    {
        try {
            // Razorpay accepts the amount in the smallest currency sub-unit (paise)
            // So we multiply rupees by 100.
            $orderData = [
                'receipt' => (string) $receiptId,
                'amount' => $amountInRupees * 100,
                'currency' => 'INR',
                'payment_capture' => 1 // 1 = Auto capture the payment automatically
            ];

            // Ask Razorpay to create an order
            $razorpayOrder = $this->api->order->create($orderData);

            return [
                'success' => true,
                'order_id' => $razorpayOrder['id'], // You send this ID to your frontend (React/Vue/Blade)
                'amount' => $orderData['amount'],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Step 2: Verify the Payment
     * This is called AFTER the user successfully pays on the frontend.
     * The frontend will send you these 3 values.
     */
    public function verifyPayment($razorpayOrderId, $razorpayPaymentId, $razorpaySignature)
    {
        try {
            $attributes = [
                'razorpay_order_id' => $razorpayOrderId,
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_signature' => $razorpaySignature
            ];

            // The SDK will automatically hash your Secret Key and the IDs, 
            // and check if it matches the signature. 
            // If it fails, it throws an Exception.
            $this->api->utility->verifyPaymentSignature($attributes);

            return true; // Payment is legitimate!
        } catch (\Exception $e) {
            return false; // Fake/tampered payment!
        }
    }

    /**
     * Step 3 (Optional): Manual Capture
     * If you set 'payment_capture' => 0 when creating the order, 
     * the money is only "authorized" (held on the user's card) but not transferred to your bank.
     * You must manually capture it within 5 days, or it gets refunded.
     */
    public function capturePayment($paymentId, $amountInRupees)
    {
        try {
            // Fetch the payment from Razorpay
            $payment = $this->api->payment->fetch($paymentId);

            // Capture the payment
            $capturedPayment = $payment->capture([
                'amount' => $amountInRupees * 100, // Amount in paise
                'currency' => 'INR'
            ]);

            return [
                'success' => true,
                'status' => $capturedPayment->status // usually "captured"
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Step 4: Issue Refund
     * If the user cancels or you need to return money.
     */
    public function refundPayment($paymentId, $amountInRupees)
    {
        try {
            // Note: It is good practice to check if the payment is already refunded
            // by fetching it first, but for simplicity, we'll call refund directly.

            $refund = $this->api->payment->fetch($paymentId)->refund([
                'amount' => $amountInRupees * 100,
                'speed' => 'normal', // 'normal' or 'optimum' (fastest)
                'receipt' => 'refund_receipt_' . time()
            ]);

            return [
                'success' => true,
                'refund_id' => $refund['id'],
                'status' => $refund['status']
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Step 5: Get Payment Details
     * Fetch current status of a payment.
     */
    public function getPaymentDetails($paymentId)
    {
        try {
            $payment = $this->api->payment->fetch($paymentId);
            return [
                'success' => true,
                'data' => $payment // Contains amount, status, card details (masked), etc.
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
