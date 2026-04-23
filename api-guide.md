# API Guide

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/` | Get user profile |
| PUT | `/user/` | Update name |
| PUT | `/user/preferences` | Update preferences |

---

## Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "favoriteCuisine": "Italian",
    "dietaryPreferences": ["Vegetarian"],
    "allergies": ["Peanuts"],
    "availableIngredients": ["tomato", "onion", "garlic"],
    "avoidedIngredients": ["mushroom"],
    "preferredIngredients": ["paneer", "rice"]
  }'
```

## Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "userId": 1
}
```

## Get User

```bash
curl -X GET http://localhost:5000/api/user/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Update Name

```bash
curl -X PUT http://localhost:5000/api/user/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

## Update Preferences

```bash
curl -X PUT http://localhost:5000/api/user/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "favoriteCuisine": "Indian",
    "dietaryPreferences": ["Vegan", "Keto"],
    "allergies": ["Soy", "Eggs"],
    "availableIngredients": ["chicken", "onion", "tomato"],
    "avoidedIngredients": ["beef", "pork"],
    "preferredIngredients": ["paneer", "rice"]
  }'
```