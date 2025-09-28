interface PayHerePaymentObject {
    sandbox: boolean;
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    amount: string;
    currency: string;
    hash: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    country?: string;
}

interface PayHere {
    startPayment(payment: PayHerePaymentObject): void;
    onCompleted?: (orderId: string) => void;
    onDismissed?: () => void;
    onError?: (error: string) => void;
}

interface Window {
    payhere: PayHere;
}