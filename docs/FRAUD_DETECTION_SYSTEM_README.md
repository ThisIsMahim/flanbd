# Fraud Detection System for EyeGears

This document explains how to set up and use the fraud detection system implemented in the EyeGears project.

## Overview

The fraud detection system automatically checks customer phone numbers against multiple courier services (Steadfast, Pathao, RedX, PaperFly) to assess the risk level of orders and provide recommendations for delivery.

## Features

- **Automatic Fraud Checks**: Performed automatically when orders are placed
- **Multi-Courier Support**: Checks against 4 major Bangladeshi courier services
- **Risk Assessment**: Categorizes customers as LOW, MEDIUM, HIGH, or NEW risk
- **Success Ratio Calculation**: Shows delivery success rates across all couriers
- **Admin Dashboard**: Complete fraud checker dashboard for manual checks
- **Order Integration**: Fraud check results integrated into admin order table
- **Email Notifications**: Admin receives fraud check results via email

## Backend Setup

### 1. Install Dependencies

The following dependencies have been added to `backend/package.json`:

```json
{
  "axios": "^1.6.0",
  "axios-cookiejar-support": "^4.0.7",
  "cheerio": "^1.0.0-rc.12",
  "tough-cookie": "^4.1.3"
}
```

Run `npm install` in the backend directory to install these dependencies.

### 2. Environment Configuration

Copy the example environment file and configure your courier credentials:

```bash
cp backend/config/fraud-checker.env.example backend/config/.env
```

Fill in your actual courier service credentials:

```env
# Steadfast Courier Credentials
STEADFAST_EMAIL=your_steadfast_email@example.com
STEADFAST_PASSWORD=your_steadfast_password

# Pathao Courier Credentials
PATHAO_USERNAME=your_pathao_username
PATHAO_PASSWORD=your_pathao_password

# RedX Courier Credentials
REDX_PHONE_NUMBER=your_redx_merchant_phone_number

# PaperFly Courier Credentials (if available)
PAPERFLY_USERNAME=your_paperfly_username
PAPERFLY_PASSWORD=your_paperfly_password
```

### 3. Database Schema Updates

The order model has been updated to include fraud check fields:

```javascript
fraudCheck: {
    phoneNumber: String,
    totalOrders: Number,
    totalDeliveries: Number,
    totalCancellations: Number,
    successRatio: Number,
    riskLevel: String, // LOW, MEDIUM, HIGH, NEW
    recommendation: String,
    couriers: Array,
    reports: Array,
    errors: Array,
    checkedAt: Date
}
```

### 4. API Endpoints

The following endpoints are available:

- `POST /api/v1/fraud-checker/check` - Manual fraud check
- `GET /api/v1/fraud-checker/stats` - Get fraud statistics
- `GET /api/v1/fraud-checker/recent` - Get recent fraud checks
- `GET /api/v1/fraud-checker/order/:orderId` - Get order fraud check details
- `POST /api/v1/fraud-checker/order/:orderId/check` - Perform fraud check for existing order
- `GET /api/v1/fraud-checker/alerts` - Get high risk orders
- `GET /api/v1/fraud-checker/export` - Export fraud data

## Frontend Setup

### 1. Updated Components

#### OrderTable.jsx
- Added fraud risk level column
- Added success ratio column
- Added "Fraud Details" button for each order
- Added fraud details modal with comprehensive information

#### FraudCheckerDashboard.jsx (New)
- Complete fraud checker dashboard
- Manual fraud check functionality
- Statistics display
- Recent fraud checks table

### 2. Features Added

- **Risk Level Display**: Color-coded risk levels (LOW=Green, MEDIUM=Yellow, HIGH=Red, NEW=Blue)
- **Success Ratio**: Shows delivery success percentage
- **Fraud Details Modal**: Comprehensive view of fraud check results
- **Courier Information**: Shows data from each courier service
- **Reports and Errors**: Displays any fraud reports or system errors

## How It Works

### 1. Automatic Fraud Check

When a customer places an order:

1. The system extracts the customer's phone number
2. Performs fraud checks against all configured courier services
3. Calculates risk level based on success ratio:
   - ≥70%: LOW risk
   - 40-69%: MEDIUM risk
   - <40%: HIGH risk
   - No orders: NEW customer
4. Stores results in the order document
5. Sends email notification to admin with fraud check results

### 2. Risk Assessment Logic

```javascript
function determineRiskLevel(successRatio, totalOrders, totalDeliveries) {
    if (totalOrders === 0) return 'NEW';
    if (totalOrders > 0 && totalDeliveries === 0) return 'NEW';
    if (successRatio >= 70) return 'LOW';
    if (successRatio >= 40) return 'MEDIUM';
    return 'HIGH';
}
```

### 3. Recommendations

- **LOW Risk**: "Good customer! Cash on delivery parcels can be sent safely."
- **MEDIUM Risk**: "Parcels can be sent based on usage and behavior, advance delivery charge is recommended."
- **HIGH Risk**: "Warning! Take delivery charge before sending parcels."
- **NEW Customer**: "New customer! No previous order history found."

## Usage

### For Admins

1. **View Orders**: The admin order table now shows fraud risk level and success ratio for each order
2. **Fraud Details**: Click "Fraud Details" button to view comprehensive fraud check information
3. **Manual Checks**: Use the Fraud Checker Dashboard to perform manual fraud checks
4. **Statistics**: View overall fraud statistics and recent checks

### For Developers

1. **Testing**: Use the test endpoints to verify individual courier connections
2. **Customization**: Modify risk assessment logic in `backend/utils/fraudChecker.js`
3. **Extending**: Add new courier services by implementing their fraud check functions

## Error Handling

The system is designed to be fault-tolerant:

- If fraud check fails, order creation continues
- Empty data is returned for unavailable courier services
- Errors are logged and displayed in the fraud details
- System continues working even if some courier services are down

## Security Considerations

- All courier credentials are stored in environment variables
- API endpoints are protected with authentication and admin role requirements
- Sensitive data is not logged to console
- Error messages don't expose internal system details

## Troubleshooting

### Common Issues

1. **Fraud Check Fails**: Check courier credentials in environment variables
2. **No Data Returned**: Verify courier service availability and credentials
3. **Authentication Errors**: Ensure proper admin role permissions
4. **Network Issues**: Check internet connectivity for courier API calls

### Debug Mode

Enable debug logging by setting environment variable:
```env
DEBUG_FRAUD_CHECKER=true
```

## Future Enhancements

- Machine learning-based risk assessment
- Historical trend analysis
- Automated alerts for high-risk orders
- Integration with more courier services
- Advanced reporting and analytics

## Support

For issues or questions regarding the fraud detection system, please refer to the DiaCareBD implementation or contact the development team.
