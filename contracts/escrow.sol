// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract CryptoBed {
    address public admin;

    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => mapping(address => uint256)) public rentalTimestamp;

    event PaymentReceived(address indexed _client, address indexed _homeowner, uint256 _amount);
    event PaymentReleased(address indexed _client, address indexed _homeowner, uint256 _amount);
    event ReservationCanceled(address indexed _client, address indexed _homeowner, uint256 _amountReturned);

    constructor() {
        admin = 0xA7a92AF1125250201e831B915FfD70176489D0a7;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function pay(address client, address homeowner, uint256 amount) external payable {
        require(msg.sender == client, "Only the client can initiate the payment");
        require(amount == msg.value, "Sent amount does not match specified amount");
        require(amount > 0, "Amount must be greater than 0");

        balances[client][homeowner] += amount;
        rentalTimestamp[client][homeowner] = block.timestamp;

        emit PaymentReceived(client, homeowner, amount);
    }

    function releasePayment(address client, address homeowner) external {
        require(block.timestamp >= rentalTimestamp[client][homeowner] + 24 hours, "24 hours not yet passed");
        require(balances[client][homeowner] > 0, "No pending payment for this client and homeowner");
        require(msg.sender == homeowner, "Only the homeowner can claim payment");

        payable(homeowner).transfer(balances[client][homeowner]);
        emit PaymentReleased(client, homeowner, balances[client][homeowner]);

        balances[client][homeowner] = 0;
        rentalTimestamp[client][homeowner] = 0;
    }

    function cancelReservation(address client, address homeowner) external onlyAdmin {
        require(balances[client][homeowner] > 0, "No pending payment for this client and homeowner");

        payable(client).transfer(balances[client][homeowner]);
        emit ReservationCanceled(client, homeowner, balances[client][homeowner]);

        balances[client][homeowner] = 0;
        rentalTimestamp[client][homeowner] = 0;
    }

    function checkPaymentStatus(address homeowner) external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < msg.sender.balance; i++) {
            totalAmount += balances[msg.sender][homeowner];
        }
        return totalAmount;
    }
}