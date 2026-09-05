# Top 20 Useful Things in Laravel Eloquent Models

Eloquent ORM is Laravel's built-in database layer. It allows you to interact with your database using PHP objects instead of writing raw SQL. Here are the top 20 most useful features and methods you will use in an Eloquent Model:

### 1. `all()`
Retrieves all records from the table.
```php
$users = User::all();
```

### 2. `find($id)`
Finds a single record by its primary key.
```php
$user = User::find(1);
```

### 3. `findOrFail($id)`
Finds a record by its primary key, or automatically throws a 404 error if not found.
```php
$user = User::findOrFail(1);
```

### 4. `where()`
Adds basic WHERE conditions to your query.
```php
$users = User::where('status', 'active')->get();
```

### 5. `create()` (Mass Assignment)
Creates and saves a new model in one line. Requires the `$fillable` property to be set on the Model.
```php
$user = User::create(['name' => 'John', 'email' => 'john@test.com']);
```

### 6. The `$fillable` Property
A security feature inside the Model that specifies which fields can be mass-assigned using `create()` or `update()`.
```php
protected $fillable = ['name', 'email', 'password'];
```

### 7. `update()`
Updates multiple records or a specific record at once.
```php
User::where('id', 1)->update(['status' => 'inactive']);
```

### 8. `delete()`
Deletes a record from the database.
```php
$user = User::find(1);
$user->delete();
```

### 9. `first()`
Gets the first record that matches the query.
```php
$user = User::where('email', 'john@test.com')->first();
```

### 10. `firstOrCreate()`
Finds a record matching the attributes, or creates it if it doesn't exist.
```php
$user = User::firstOrCreate(['email' => 'john@test.com']);
```

### 11. Relationships (`hasMany`, `belongsTo`)
Models can define how they relate to other tables.
```php
// In User Model
public function posts() {
    return $this->hasMany(Post::class);
}
```

### 12. `with()` (Eager Loading)
Loads relationships immediately to avoid the "N+1 query problem" (makes your app much faster).
```php
$users = User::with('posts')->get();
```

### 13. `pluck()`
Gets an array of values for a specific column.
```php
$names = User::pluck('name'); // ['John', 'Jane', 'Doe']
```

### 14. `count()`, `max()`, `sum()`
Quick aggregate functions directly on the database.
```php
$totalUsers = User::count();
```

### 15. The `$table` Property
By default, Laravel assumes the table name is the plural of the Model (e.g., `User` -> `users`). You can override this:
```php
protected $table = 'my_custom_users_table';
```

### 16. Soft Deletes
Instead of permanently deleting a row, it sets a `deleted_at` timestamp. The record becomes "hidden".
```php
use Illuminate\Database\Eloquent\SoftDeletes;
class User extends Model {
    use SoftDeletes;
}
```

### 17. Local Scopes
Allows you to define common query constraints inside the model to reuse them.
```php
// In Model: public function scopeActive($query) { return $query->where('status', 'active'); }
// Usage: 
$activeUsers = User::active()->get();
```

### 18. Accessors (Getters)
Formats an attribute automatically when you retrieve it from the database.
```php
// In Model:
public function getFirstNameAttribute($value) {
    return ucfirst($value);
}
```

### 19. Mutators (Setters)
Formats an attribute automatically before saving it to the database.
```php
// In Model:
public function setPasswordAttribute($value) {
    $this->attributes['password'] = bcrypt($value);
}
```

### 20. `paginate()`
Automatically paginates results and handles the limit/offset behind the scenes.
```php
$users = User::paginate(10); // Gets 10 users per page
```
User::where('id', '>', 10)->get();