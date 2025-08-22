# MasShop API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [Error Handling](#error-handling)
5. [API Endpoints by Module](#api-endpoints-by-module)
   - [Authentication](#authentication-endpoints)
   - [Products](#products-endpoints)
   - [Orders](#orders-endpoints)
   - [Categories](#categories-endpoints)
   - [Companies](#companies-endpoints)
   - [Customers](#customers-endpoints)
   - [Delivery Personnel](#delivery-personnel-endpoints)
   - [Inventory](#inventory-endpoints)
   - [Offers & Promotions](#offers--promotions-endpoints)
   - [Coupons](#coupons-endpoints)
   - [Tags](#tags-endpoints)
   - [Notices](#notices-endpoints)
   - [Store Settings](#store-settings-endpoints)
   - [Dashboard Analytics](#dashboard-analytics-endpoints)
6. [Request/Response Formats](#requestresponse-formats)
7. [File Upload Endpoints](#file-upload-endpoints)

## API Overview

### Base URLs
- **Admin API**: `http://modytest-002-site3.atempurl.com/RetailAPI/Admin`
- **Public API**: `http://modytest-002-site3.atempurl.com/RetailAPI`

### Headers
All requests should include:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

### Store Context
Most endpoints require a store ID parameter. The default store ID is `1`.

## Authentication

### Login
```http
POST /Auth/Authenticate/1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "result": {
    "code": 200,
    "message": "Login successful"
  },
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here",
    "expiration": "2024-01-01T00:00:00Z"
  }
}
```

### Register Admin
```http
POST /Auth/RegisterAsAdmin/
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securePassword123",
  "name": "Admin Name",
  "phoneNumber": "+1234567890"
}
```

### Get User Profile
```http
GET /Auth/GetProfile
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "result": {
    "code": 200,
    "message": "Success"
  },
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "userType": "StoreAdmin",
    "storeId": "1"
  }
}
```

## Common Patterns

### Standard Response Structure
```json
{
  "result": {
    "code": 200,        // 200 for success, other codes for errors
    "message": "Success"
  },
  "data": {} // Response data or null
}
```

### Paginated Response Structure
```json
{
  "result": {
    "code": 200,
    "message": "Success"
  },
  "data": {
    "items": [],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 100,
    "totalPages": 10
  }
}
```

### Common Query Parameters
- `PageNumber`: Page number for pagination (default: 1)
- `PageSize`: Items per page (default: 10)
- `SearchTerm`: Search filter
- `SortBy`: Sort field
- `SortOrder`: "asc" or "desc"

## Error Handling

### Error Response Format
```json
{
  "result": {
    "code": 400,  // HTTP status code
    "message": "Error description"
  },
  "data": null
}
```

### Common Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

## API Endpoints by Module

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/Auth/Authenticate/1` | User login |
| POST | `/Auth/RegisterAsAdmin/` | Register new admin |
| GET | `/Auth/GetProfile` | Get current user profile |

### Products Endpoints

#### List Products
```http
GET /Item/GetAllItems/1?PageNumber=1&PageSize=10&SearchTerm=&TagIds=&ItemUnitID=&CategoryID=&CompanyID=&HasOffer=false
```

#### Get Product by ID
```http
GET /Item/GetItemById/1/{productId}
```

#### Get Next Valid Product ID
```http
GET /Item/GetValidId/1
```

#### Create Retail Product
```http
POST /Item/CreateItem/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "منتج جديد",
  "nameEn": "New Product",
  "descriptionAr": "وصف المنتج",
  "descriptionEn": "Product description",
  "itemUnitId": 1,
  "categoryId": 1,
  "companyId": 1,
  "price": 99.99,
  "cost": 50.00,
  "sku": "SKU123",
  "barcode": "1234567890",
  "isActive": true,
  "hasOffer": false,
  "offerPrice": 0,
  "flavours": []
}
```

#### Create Wholesale Product
```http
POST /Item/CreateItemForWholeSale/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "منتج جملة",
  "nameEn": "Wholesale Product",
  "descriptionAr": "وصف المنتج",
  "descriptionEn": "Product description",
  "categoryId": 1,
  "companyId": 1,
  "price": 999.99,
  "isActive": true,
  "minimumQuantity": 10,
  "wholesalePrice": 899.99
}
```

#### Update Product
```http
PUT /Item/UpdateItem/1
Content-Type: application/json

{
  // Same structure as create with updated values
}
```

#### Delete Product
```http
DELETE /Item/DeleteItem/1/{productId}
```

#### Upload Product Image
```http
POST /Item/UploadImageForItem/1
Content-Type: multipart/form-data

FormData:
- file: [image file]
- itemId: [product ID]
```

### Orders Endpoints

#### List Orders
```http
GET /Order/GeAllOrders/{storeId}?PageNumber=1&PageSize=10&Status=&CustomerId=&DeliveryBoyId=&FromDate=&ToDate=
```

#### Get Order Details
```http
GET /Order/GetOrderDetails/{storeId}/{orderId}
```

#### Accept Order
```http
PUT /Order/AcceptOrder/{storeId}/{orderId}
```

#### Reject Order
```http
PUT /Order/RejectOrder/{storeId}/{orderId}
Content-Type: application/json

{
  "reason": "Out of stock"
}
```

#### Update Order Status (Bulk)
```http
PUT /Order/UpdateOrdersStatus/{storeId}
Content-Type: application/json

{
  "orderIds": [1, 2, 3],
  "status": "Delivered"
}
```

#### Assign to Delivery Boy
```http
PUT /Order/AssignOrdersToDeliveryBoyManually/{storeId}
Content-Type: application/json

{
  "orderIds": [1, 2, 3],
  "deliveryBoyId": "delivery_boy_id"
}
```

### Categories Endpoints

#### List Categories
```http
GET /Category/GetAllCategories/1?PageNumber=1&PageSize=10&MainCategoryId=&SearchTerm=
```

#### Get Category by ID
```http
GET /Category/GetCategoryById/1/{categoryId}
```

#### Create Category
```http
POST /Category/CreateCategory/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "فئة جديدة",
  "nameEn": "New Category",
  "mainCategoryId": 1,
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Category
```http
PUT /Category/UpdateCategory/1
Content-Type: application/json

{
  // Same structure as create with updated values
}
```

#### Delete Category
```http
DELETE /Category/DeleteCategory/1/{categoryId}
```

#### Toggle Category Status
```http
PUT /Category/ToggleCategoryStatus/1/{categoryId}
```

### Companies Endpoints

#### List Companies
```http
GET /Company/GetAllCompanies/1?PageNumber=1&PageSize=10&SearchTerm=
```

#### Get Company by ID
```http
GET /Company/GetCompanyById/1/{companyId}
```

#### Create Company
```http
POST /Company/CreateCompany/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "شركة جديدة",
  "nameEn": "New Company",
  "descriptionAr": "وصف الشركة",
  "descriptionEn": "Company description",
  "isActive": true
}
```

#### Upload Company Logo
```http
POST /Company/UploadImageForCompany/{storeId}
Content-Type: multipart/form-data

FormData:
- file: [image file]
- companyId: [company ID]
```

#### Upload Company Banner
```http
POST /Company/UploadImageForCompanyBanner/{storeId}
Content-Type: multipart/form-data

FormData:
- files: [multiple image files]
- companyId: [company ID]
```

### Customers Endpoints

#### List Customers
```http
GET /ApplicationUser/GetAllUsers/1?userType=3&PageNumber=1&PageSize=10&SearchTerm=
```

#### Toggle Customer Status
```http
PUT /ApplicationUser/ToggleUserStatus/1
Content-Type: application/json

{
  "userId": "user_id",
  "isActive": true
}
```

### Delivery Personnel Endpoints

#### List Delivery Boys
```http
GET /ApplicationUser/GetAllUsers/1?userType=4&PageNumber=1&PageSize=10
```

#### Create Delivery Boy
```http
POST /ApplicationUser/CreateDeliveryBoy/1
Content-Type: application/json

{
  "name": "Delivery Person Name",
  "email": "delivery@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "isActive": true
}
```

### Inventory Endpoints

#### Get Inventory Actions
```http
GET /InventoryAction/GetAllInventoryActions/1?PageNumber=1&PageSize=10&ItemId=&ActionType=
```

#### Create Inventory Action
```http
POST /InventoryAction/CreateInventoryAction/1
Content-Type: application/json

{
  "itemId": 1,
  "actionType": "Add",  // Add, Remove, Adjust
  "quantity": 100,
  "reason": "Stock replenishment",
  "date": "2024-01-01T00:00:00Z"
}
```

#### Bulk Inventory Update
```http
POST /InventoryAction/BulkInventoryUpdate/1
Content-Type: application/json

{
  "actions": [
    {
      "itemId": 1,
      "actionType": "Add",
      "quantity": 100
    },
    {
      "itemId": 2,
      "actionType": "Remove",
      "quantity": 50
    }
  ]
}
```

### Offers & Promotions Endpoints

#### List Offers
```http
GET /ItemOffer/GetAllItemOffers/1?PageNumber=1&PageSize=10&IsActive=true
```

#### Create Offer
```http
POST /ItemOffer/CreateItemOffer/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "عرض خاص",
  "nameEn": "Special Offer",
  "descriptionAr": "وصف العرض",
  "descriptionEn": "Offer description",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "discountPercentage": 20,
  "isActive": true
}
```

#### Add Items to Offer
```http
POST /ItemOfferDetails/CreateItemOfferDetails/1
Content-Type: application/json

{
  "offerId": 1,
  "itemIds": [1, 2, 3, 4, 5]
}
```

#### Add Items by Company
```http
POST /ItemOfferDetails/CreateItemOfferDetailsByCompany/{storeId}
Content-Type: application/json

{
  "offerId": 1,
  "companyId": 1
}
```

#### Add Items by Category
```http
POST /ItemOfferDetails/CreateItemOfferDetailsByCategory/{storeId}
Content-Type: application/json

{
  "offerId": 1,
  "categoryId": 1
}
```

### Coupons Endpoints

#### List Coupons
```http
GET /Coupon/GetAllCoupons/{storeId}?PageNumber=1&PageSize=10&IsActive=true
```

#### Get Coupon by Code
```http
GET /Coupon/GetCouponById/{couponCode}?storeId={storeId}
```

#### Create Coupon
```http
POST /Coupon/CreateCoupon/{storeId}
Content-Type: application/json

{
  "couponCode": "SAVE20",
  "descriptionAr": "خصم 20%",
  "descriptionEn": "20% Discount",
  "discountType": "Percentage", // Percentage or Fixed
  "discountValue": 20,
  "minimumOrderAmount": 100,
  "maximumDiscountAmount": 50,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "usageLimit": 100,
  "usagePerCustomer": 1,
  "isActive": true
}
```

### Tags Endpoints

#### List Tags
```http
GET /Tag/GetAllTags/1
```

#### Create Tag
```http
POST /Tag/CreateTag/1
Content-Type: application/json

{
  "id": 0,
  "nameAr": "علامة جديدة",
  "nameEn": "New Tag",
  "color": "#FF5733",
  "isActive": true
}
```

### Notices Endpoints

#### List Notices
```http
GET /Notice/GetAllNotices/1?PageNumber=1&PageSize=10
```

#### Create Notice
```http
POST /Notice/CreateNotice/1
Content-Type: application/json

{
  "id": 0,
  "titleAr": "إشعار مهم",
  "titleEn": "Important Notice",
  "contentAr": "محتوى الإشعار",
  "contentEn": "Notice content",
  "type": "Info", // Info, Warning, Alert
  "isActive": true,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

### Store Settings Endpoints

#### Get Store Settings
```http
GET /StoreSettings/GetStoreSettings/1
```

#### Update Store Settings
```http
PUT /StoreSettings/UpdateStoreSettings/1
Content-Type: application/json

{
  "storeNameAr": "اسم المتجر",
  "storeNameEn": "Store Name",
  "appMode": "RetailMarket", // RetailMarket, WholeSale, Both
  "currency": "USD",
  "taxRate": 15,
  "isInventoryTracked": true,
  "allowGuestCheckout": false,
  "minimumOrderAmount": 50,
  "deliveryRadius": 10,
  "workingHours": {
    "sunday": { "open": "09:00", "close": "22:00" },
    "monday": { "open": "09:00", "close": "22:00" },
    // ... other days
  }
}
```

#### Get Store Address
```http
GET /StoreAddress/GetStoreAddresses/1
```

#### Create Store Address
```http
POST /StoreAddress/CreateStoreAddress/1
Content-Type: application/json

{
  "id": 0,
  "addressLine1": "123 Main Street",
  "addressLine2": "Suite 100",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "isMainBranch": true,
  "isActive": true
}
```

### Dashboard Analytics Endpoints

#### Get Dashboard Summary
```http
GET /Dashboard/Summary/1/

Response:
{
  "result": {
    "code": 200,
    "message": "Success"
  },
  "data": {
    "totalRevenue": 150000,
    "totalOrders": 1234,
    "totalCustomers": 567,
    "totalProducts": 890,
    "revenueToday": 5000,
    "ordersToday": 45,
    "topSellingProducts": [
      {
        "productId": 1,
        "productName": "Product 1",
        "quantity": 100,
        "revenue": 10000
      }
    ],
    "recentOrders": [],
    "lowStockItems": [],
    "salesChart": {
      "labels": ["Jan", "Feb", "Mar"],
      "data": [10000, 12000, 15000]
    }
  }
}
```

## Request/Response Formats

### Creating Resources
1. First, get a valid ID:
   ```http
   GET /{resource}/GetValidId/1
   ```

2. Then create the resource with the obtained ID:
   ```http
   POST /{resource}/Create{Resource}/1
   ```

### Updating Resources
```http
PUT /{resource}/Update{Resource}/1
Content-Type: application/json

{
  "id": 123,
  // ... updated fields
}
```

### Deleting Resources
```http
DELETE /{resource}/Delete{Resource}/1/{resourceId}
```

## File Upload Endpoints

All file uploads use `multipart/form-data`:

### Product Image Upload
```http
POST /Item/UploadImageForItem/1
Content-Type: multipart/form-data

FormData:
- file: [image file]
- itemId: [product ID]
```

### Category Image Upload
```http
POST /Category/UploadImageForCategory/{storeId}
Content-Type: multipart/form-data

FormData:
- file: [image file]
- categoryId: [category ID]
```

### Company Logo Upload
```http
POST /Company/UploadImageForCompany/{storeId}
Content-Type: multipart/form-data

FormData:
- file: [image file]
- companyId: [company ID]
```

### Excel Import
```http
POST /File/ImportExcel/1
Content-Type: multipart/form-data

FormData:
- file: [Excel file]
- importType: "products" // products, customers, etc.
```

## Notes

1. **Authentication**: All endpoints except login require a valid JWT token
2. **Store Context**: Most endpoints are scoped to a specific store (usually ID: 1)
3. **Localization**: Many entities support Arabic (Ar) and English (En) fields
4. **Pagination**: List endpoints support pagination with PageNumber and PageSize
5. **Response Codes**: Always check `result.code` for operation success (200 = success)
6. **Date Format**: Use ISO 8601 format for all date/time fields
7. **File Uploads**: Maximum file size and allowed formats vary by endpoint