// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ComplicoreInstantSettlement
 * @notice Automates Delivery-vs-Payment settlement for travel bookings.
 * Triggers can be sourced from oracle-verified biometric check-in
 * or standards-based identity events (e.g., IATA One ID adapters).
 */
contract ComplicoreInstantSettlement {
    enum BookingStatus {
        Pending,
        Confirmed,
        CheckedIn,
        Cancelled,
        Disputed
    }

    struct Booking {
        address traveler;
        address supplier;
        uint256 amount;
        BookingStatus status;
        bytes32 identityCommitment;
        bool settled;
    }

    mapping(bytes32 => Booking) public bookings;
    address public complianceOracle;
    address public owner;

    event FundsEscrowed(bytes32 indexed bookingId, address indexed traveler, address indexed supplier, uint256 amount);
    event BookingConfirmed(bytes32 indexed bookingId);
    event SettlementExecuted(bytes32 indexed bookingId, uint256 amount);
    event BookingCancelled(bytes32 indexed bookingId);
    event ComplianceOracleUpdated(address indexed previousOracle, address indexed newOracle);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyComplianceOracle() {
        require(msg.sender == complianceOracle, "unauthorized oracle");
        _;
    }

    constructor(address _oracle) {
        require(_oracle != address(0), "invalid oracle");
        owner = msg.sender;
        complianceOracle = _oracle;
    }

    /// @notice Owner can rotate oracle key used for biometric/identity attestations.
    function setComplianceOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "invalid oracle");
        address previous = complianceOracle;
        complianceOracle = _oracle;
        emit ComplianceOracleUpdated(previous, _oracle);
    }

    /// @notice Escrow traveler funds at booking time.
    function escrowPayment(bytes32 bookingId, address supplier, bytes32 identityCommitment) external payable {
        require(supplier != address(0), "invalid supplier");
        require(msg.value > 0, "amount required");
        require(bookings[bookingId].traveler == address(0), "booking exists");

        bookings[bookingId] = Booking({
            traveler: msg.sender,
            supplier: supplier,
            amount: msg.value,
            status: BookingStatus.Pending,
            identityCommitment: identityCommitment,
            settled: false
        });

        emit FundsEscrowed(bookingId, msg.sender, supplier, msg.value);
    }

    /// @notice Optional supplier confirmation before check-in settlement.
    function confirmBooking(bytes32 bookingId) external {
        Booking storage b = bookings[bookingId];
        require(b.supplier != address(0), "unknown booking");
        require(msg.sender == b.supplier, "only supplier");
        require(b.status == BookingStatus.Pending, "invalid status");

        b.status = BookingStatus.Confirmed;
        emit BookingConfirmed(bookingId);
    }

    /**
     * @notice Releases escrowed funds on successful biometric/identity match.
     * @dev Oracle should provide a proof commitment compatible with off-chain verifier.
     */
    function verifyAndSettle(bytes32 bookingId, bytes32 biometricProof) external onlyComplianceOracle {
        Booking storage b = bookings[bookingId];

        require(b.supplier != address(0), "unknown booking");
        require(!b.settled, "already settled");
        require(
            b.status == BookingStatus.Pending || b.status == BookingStatus.Confirmed,
            "not settleable"
        );

        if (biometricProof == b.identityCommitment) {
            b.status = BookingStatus.CheckedIn;
            b.settled = true;
            payable(b.supplier).transfer(b.amount);
            emit SettlementExecuted(bookingId, b.amount);
        }
    }

    /// @notice Traveler can cancel pre-settlement and reclaim escrowed funds.
    function cancelBooking(bytes32 bookingId) external {
        Booking storage b = bookings[bookingId];
        require(b.traveler == msg.sender, "only traveler");
        require(!b.settled, "already settled");
        require(
            b.status == BookingStatus.Pending || b.status == BookingStatus.Confirmed,
            "cannot cancel"
        );

        b.status = BookingStatus.Cancelled;
        uint256 refund = b.amount;
        b.amount = 0;
        payable(b.traveler).transfer(refund);
        emit BookingCancelled(bookingId);
    }
}
