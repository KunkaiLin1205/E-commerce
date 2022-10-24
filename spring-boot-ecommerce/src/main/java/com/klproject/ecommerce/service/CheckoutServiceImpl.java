package com.klproject.ecommerce.service;

import com.klproject.ecommerce.dao.CustomerRepository;
import com.klproject.ecommerce.dto.Purchase;
import com.klproject.ecommerce.dto.PurchaseResponse;
import com.klproject.ecommerce.entity.Customer;
import com.klproject.ecommerce.entity.Order;
import com.klproject.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //get the order info
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTN();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate address info
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to db
        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTN() {
        //generate random string with UUID number
        return UUID.randomUUID().toString();
    }

}
