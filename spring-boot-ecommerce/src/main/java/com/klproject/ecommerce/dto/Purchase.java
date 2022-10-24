package com.klproject.ecommerce.dto;

import com.klproject.ecommerce.entity.Address;
import com.klproject.ecommerce.entity.Customer;
import com.klproject.ecommerce.entity.Order;
import com.klproject.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
