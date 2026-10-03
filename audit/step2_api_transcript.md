# Step 2 API Transcript

### POST /auth/login (Admin)
**Response** (Status 200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTE2MzM2NTIsInN1YiI6IjQ5YWQwZWQ5LTJmZTAtNDZlNy04ZjNlLWI1ZGEzNzI3ZmEzYyJ9.yPuItQnXUNVMEjca6wuSd7Mr05s6hOwAQEy_3wh7xD4",
  "token_type": "bearer"
}
```

### POST /auth/login (Buyer)
**Response** (Status 200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTE2MzM2NTMsInN1YiI6IjJiYzJjYjk2LWE0Y2ItNDdkZS05NjQ1LTQ5NzA4N2QzNTM0NCJ9.HJhFx83sQo52nBgLQSnTNAMphrpIuWP_ZvCpgZdxWUo",
  "token_type": "bearer"
}
```

### GET /transactions
**Headers**:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTE2MzM2NTIsInN1YiI6IjQ5YWQwZWQ5LTJmZTAtNDZlNy04ZjNlLWI1ZGEzNzI3ZmEzYyJ9.yPuItQnXUNVMEjca6wuSd7Mr05s6hOwAQEy_3wh7xD4"
}
```

**Response** (Status 200):
```json
[]
```

### GET /marketplace/listings
**Response** (Status 404):
```json
{
  "detail": "Not Found"
}
```
