package com.klproject.ecommerce.service;

import com.klproject.ecommerce.dto.Purchase;
import com.klproject.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
