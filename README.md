# Menu API Documentation

Base URL: `http://localhost:5000/api/menu`

# 1. Add an Item Menu

**POST** `/`

## Request Body

``` json
{
  "name": "Nasi Goreng",
  "category": "Main Course",
  "calories": 450,
  "price": 20000,
  "ingredients": ["rice", "egg", "soy sauce"],
  "description": "Indonesian fried rice."
}
```

## Success Response (201)

``` json
{
  "message": "Menu created successfully",
  "data": {
    "id": 123456,
    "name": "Nasi Goreng",
    "category": "Main Course",
    "calories": 450,
    "price": 20000,
    "ingredients": ["rice", "egg", "soy sauce"],
    "description": "Indonesian fried rice.",
    "created_at": "2025-02-01T12:00:00.000Z",
    "updated_at": "2025-02-01T12:00:00.000Z"
  }
}
```

## Error Response (400)

``` json
{
  "message": "Failed to create menu",
  "error": "Validation error message"
}
```


---

# 2. Get All Menus

**GET** `/`

### Response

```
{
  "data": [ ...menus ]
}
```

---

# 3. Search Menus

**GET** `/search?q=term&page=1&per_page=10`

### Query Parameters

* `q` – search keyword
* `page` – page number
* `per_page` – items per page

### Response

```
{
  "data": [...results],
  "pagination": {
    "total": 42,
    "page": 1,
    "per_page": 10
  }
}
```

---

# 4. Group Menus by Category

**GET** `/group-by-category?mode=[count|list]&per_category=10`

### Mode: count

```
{
  "data": {
    "Drinks": 5,
    "Main Course": 12,
    "Snacks": 8
  }
}
```

### Mode: list

```
{
  "data": {
    "Drinks": [ ...up to per_category items... ],
    "Main Course": [...],
    "Snacks": [...]
  }
}
```

---

# 5. Get Menu by ID

**GET** `/:id`

### Response

```
{
  "data": { ...menu object... }
}
```

### 404 Response

```
{
  "message": "Menu not found"
}
```

---

# 6. Update Menu

**PUT** `/:id`

### Request Body

(Same structure as create)

### Success Response

```
{
  "message": "Menu updated successfully",
  "data": { ...updated menu... }
}
```

---

# 7. Delete Menu

**DELETE** `/:id`

### Success Response

```
{
  "message": "Menu deleted successfully"
}
```

### 404 Response

```
{
  "message": "Menu not found"
}
```

---

# Authentication Header Example

```
curl -H "Authorization: Bearer <YOUR_GEMINI_API_KEY>" http://localhost:5000/api/menu
```
