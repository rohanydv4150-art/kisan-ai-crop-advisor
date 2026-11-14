# Backend API Documentation

Base URL: `/api/v1`

All responses follow the standard JSON envelope:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Detailed error explanation",
  "code": "ERROR_CODE",
  "details": null
}
```

---

## 1. System Endpoints

### `GET /health`
Returns system status and server uptime.
- **Auth:** Public
- **Response:**
  ```json
  {
    "success": true,
    "message": "Agricultural Crop Advisory System is healthy",
    "data": {
      "status": "UP",
      "uptime": 120.45,
      "timestamp": "2026-11-13T10:00:00.000Z"
    }
  }
  ```

---

## 2. Farmer Profile Endpoints

### `GET /profile`
Retrieves the authenticated farmer's profile.
- **Auth:** `Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "user_id": "uuid",
      "full_name": "Ramesh Patel",
      "state": "Maharashtra",
      "district": "Nashik",
      "preferred_language": "en",
      "default_land_area": 3.5,
      "land_unit": "acre"
    }
  }
  ```

### `PATCH /profile`
Updates farmer profile fields.
- **Auth:** `Bearer <token>`
- **Body:** Partial farmer profile object

---

## 3. Crop & Agricultural Advisory Endpoints

### `POST /advisory/crop`
Generates top 5 AI crop recommendations.
- **Auth:** `Bearer <token>`
- **Body:**
  ```json
  {
    "location": {
      "state": "Karnataka",
      "district": "Bengaluru Rural",
      "village": "Hoskote"
    },
    "soil": {
      "type": "Red Soil",
      "ph": 6.5,
      "nitrogen": 240,
      "phosphorus": 22,
      "potassium": 180,
      "testing_available": true
    },
    "land": {
      "area": 3,
      "unit": "acre"
    },
    "water_availability": "Moderate",
    "irrigation_method": "Drip Irrigation",
    "season": "Kharif",
    "language": "en"
  }
  ```

### `POST /advisory/soil`
Generates soil fertility and improvement advisory.
- **Auth:** `Bearer <token>`
- **Body:** `{ soil_type, ph, nitrogen, phosphorus, potassium, observed_issues, language }`

### `POST /advisory/fertilizer`
Generates crop-specific nutrient management guidance.
- **Auth:** `Bearer <token>`
- **Body:** `{ crop_name, growth_stage, soil_type, farming_type, language }`

### `POST /advisory/irrigation`
Generates growth-stage irrigation scheduling.
- **Auth:** `Bearer <token>`
- **Body:** `{ crop_name, soil_type, water_availability, irrigation_method, growth_stage, language }`

### `POST /advisory/disease`
Diagnoses visible crop symptoms with Integrated Pest Management guidance.
- **Auth:** `Bearer <token>`
- **Body:** `{ crop_name, affected_part, symptoms, crop_stage, weather_context, language }`

### `GET /advisory`
Retrieves past advisory reports with filtering.
- **Auth:** `Bearer <token>`
- **Query Parameters:**
  - `type` (optional): `crop`, `soil`, `fertilizer`, `irrigation`, `disease`
  - `search` (optional): keyword string

### `GET /advisory/:id`
Retrieves an individual advisory report. Validates user ownership.
- **Auth:** `Bearer <token>`

### `DELETE /advisory/:id`
Deletes a user-owned advisory report.
- **Auth:** `Bearer <token>`

---

## 4. AI Agriculture Chatbot Endpoints

### `GET /chat/conversations`
Lists the farmer's AI consultations.
- **Auth:** `Bearer <token>`

### `POST /chat/conversations`
Creates a new conversation thread.
- **Auth:** `Bearer <token>`
- **Body:** `{ "title": "New Consultation", "language": "en" }`

### `GET /chat/conversations/:id`
Retrieves conversation messages.
- **Auth:** `Bearer <token>`

### `POST /chat/conversations/:id/messages`
Sends a question to the agricultural assistant and generates a structured response.
- **Auth:** `Bearer <token>`
- **Body:**
  ```json
  {
    "content": "What is the best green manure crop for improving sandy soil?",
    "language": "en"
  }
  ```

### `DELETE /chat/conversations/:id`
Deletes a conversation and its message history.
- **Auth:** `Bearer <token>`

---

## 5. Weather Endpoints

### `GET /weather/current`
Fetches verified live meteorological observations.
- **Auth:** Public
- **Query Parameters:** `state`, `district`, `lat`, `lon`

### `GET /weather/forecast`
Fetches a 7-day agricultural weather forecast.
- **Auth:** Public

---

## 6. Saved Crops Endpoints

### `GET /saved-crops`
Lists shortlisted bookmarked crops.
- **Auth:** `Bearer <token>`

### `POST /saved-crops`
Bookmarks a recommended crop.
- **Auth:** `Bearer <token>`
- **Body:** `{ "crop_name": "Finger Millet", "crop_category": "Cereals", "notes": "...", "advisory_report_id": "uuid" }`

### `DELETE /saved-crops/:id`
Removes a saved crop bookmark.
- **Auth:** `Bearer <token>`

---

## 7. Dashboard Endpoints

### `GET /dashboard/summary`
Aggregates profile summary, metrics, Recharts distribution charts, recent activity, and bookmarked crops.
- **Auth:** `Bearer <token>`
