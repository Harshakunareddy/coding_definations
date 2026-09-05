/*
========================================
LARAVEL INTERVIEW QUESTIONS (1–30)
WITH PROPER EXPLANATIONS (SPEAKABLE)
========================================
*/

/*
1. WHAT IS LARAVEL?
Laravel is a free, open-source PHP web framework based on MVC pattern.
It provides elegant syntax and built-in tools for routing, sessions, etc.
It speeds up web development securely.
*/
// composer create-project laravel/laravel myApp


/*
2. ARTISAN
Artisan is the command-line interface included with Laravel.
It provides helpful commands to generate files like controllers, models.
It speeds up repetitive development tasks.
*/
// php artisan make:controller UserController


/*
3. ROUTING
Routing maps URLs to specific controllers or closures.
Routes are defined in routes/web.php or routes/api.php.
Allows easy management of application endpoints.
*/
// Route::get('/users', [UserController::class, 'index']);


/*
4. MIDDLEWARE
Middleware acts as a bridge between a request and a response.
It filters HTTP requests entering your application.
Used for authentication, CORS, and logging.
*/
// class CheckAuth { public function handle($request, $next) { return $next($request); } }


/*
5. ELOQUENT ORM
Eloquent is Laravel's built-in Object-Relational Mapper.
It allows interacting with database using PHP objects instead of SQL queries.
Each database table has a corresponding "Model".
*/
// $users = User::where('active', 1)->get();


/*
6. MIGRATIONS
Migrations are like version control for your database schema.
They allow teams to easily modify and share database structures.
Avoids manual SQL structure creation.
*/
// php artisan make:migration create_users_table


/*
7. SEEDERS
Seeders are used to populate database tables with dummy data.
Useful for testing and initial application setup.
Often used alongside Factories.
*/
// php artisan db:seed


/*
8. CONTROLLERS
Controllers handle the incoming HTTP requests and return responses.
They group related request handling logic into a single class.
Keeps route files clean and manageable.
*/
// class UserController extends Controller { public function index() { } }


/*
9. BLADE TEMPLATE
Blade is Laravel's powerful and simple templating engine.
It allows using plain PHP code in views and compiles to pure PHP.
Provides features like template inheritance and components.
*/
// @if($user) <p>{{ $user->name }}</p> @endif


/*
10. SERVICE CONTAINER
Service Container = "The Smart Toolbox / Factory".
It automatically builds and hands you the tools (classes) you need.
(Handles dependency injection so you don't have to write 'new ClassName()').
*/
// public function pay(PaymentGateway $payment) { } // Automatically injected!


/*
11. SERVICE PROVIDERS
Service Provider = "The Factory Manager / Instruction Manual".
It teaches the Service Container HOW to build complicated tools.
(Registers and binds your classes into the Container before the app starts).
*/
// public function register() { $this->app->bind('Payment', function() { return new PaymentGateway(); }); }


/*
12. FACADES
Facades provide a "static" interface to classes available in container.
They allow you to use methods without injecting the class.
Examples: Cache::get(), Config::set().
*/
// Cache::put('key', 'value', 60);


/*
13. CSRF TOKEN
CSRF (Cross-Site Request Forgery) protection prevents malicious requests.
Laravel automatically generates a CSRF token for each active user session.
It must be included in HTML forms to verify the request origin.
*/
// @csrf in Blade forms


/*
14. VALIDATION
Laravel provides easy methods to validate incoming data.
Can be done in controllers or using Form Request classes.
Automatically redirects back with error messages if validation fails.
*/
// $request->validate(['name' => 'required|max:255']);


/*
15. QUEUES
Queues allow delaying time-consuming tasks like sending emails.
Speeds up web requests by running heavy tasks in the background.
Supports various drivers like Redis, Database.
*/
// dispatch(new SendEmailJob($user));


/*
16. EVENTS AND LISTENERS
Events provide a simple observer implementation.
You can subscribe and listen to events in your application.
Useful for decoupling code (e.g., sending welcome email after registration).
*/
// Event::dispatch(new UserRegistered($user));


/*
17. TASK SCHEDULING
Task Scheduling allows scheduling cron jobs inside Laravel itself.
Defined in app/Console/Kernel.php.
Eliminates the need to add multiple SSH cron entries on the server.
*/
// $schedule->command('emails:send')->daily();


/*
18. FACTORIES
Factories define blueprints to generate fake data for models.
Used mostly in testing and database seeding.
Uses Faker library internally.
*/
// User::factory()->count(50)->create();



// public function definition()
// {
//     return [
//         // id is missing because the database auto-increments it automatically!
//         'name'   => fake()->name(),               // Generates: "John Doe"
//         'email'  => fake()->unique()->safeEmail(), // Generates: "john99@example.com"
//         'number' => fake()->phoneNumber(),         // Generates: "555-123-4567"
//     ];
// }


/*
19. RELATIONSHIPS
Eloquent makes managing database relationships easy.
Supports One-To-One, One-To-Many, Many-To-Many, etc.
Defined as methods on the model class.
*/
// public function posts() { return $this->hasMany(Post::class); }


/*
20. MVC IN LARAVEL
Laravel strictly follows the Model-View-Controller architecture.
Models (Eloquent) handle database.
Views (Blade) handle UI.
Controllers connect Models and Views.
*/
// Request -> Route -> Controller -> Model -> View -> Response


/*
21. WHAT IS DEPENDENCY INJECTION?
Dependency Injection (DI) is passing required objects into a class instead of creating them inside.
Laravel's Service Container automatically resolves and injects these dependencies
(e.g., in Controller constructors).
Makes code much easier to test and loosely coupled.
*/
// public function __construct(UserRepository $users) { $this->users = $users; }


/*
22. HOW TO PREVENT SQL INJECTION IN LARAVEL
Laravel’s Eloquent ORM and Query Builder use PDO parameter binding under the hood.
This automatically prevents SQL injection for all regular queries.
Only raw queries (e.g., DB::raw()) need manual caution.
*/
// User::where('email', $request->email)->first(); // Completely safe


/*
23. WHAT ARE OBSERVERS IN LARAVEL?
Observers group event listeners for an Eloquent model into a single class.
Methods like created, updated, deleting automatically trigger when the model state changes.
Keeps controllers clean and encapsulates model logic.
*/
// class UserObserver { public function created(User $user) { /* send email */ } }
// php artisan make:observer UserObserver --model=User



/*
24. QUERY BUILDER VS ELOQUENT
Query Builder is faster, uses less memory, and allows writing raw-like SQL easily.
Eloquent is an ORM (slower but more readable) that maps database rows to Model objects.
Use Query Builder for heavy queries/reports, and Eloquent for standard CRUD.
*/
// DB::table('users')->get(); // Query Builder
// User::all(); // Eloquent


/*
25. HOW TO UPLOAD A FILE IN LARAVEL
Laravel provides a unified Storage API (local, S3, etc.).
You can use the store() method directly on the uploaded file from the Request.
It handles file naming and saving securely.
*/
// $path = $request->file('avatar')->store('avatars', 'public');


/*
26. WHAT ARE ACCESSORS AND MUTATORS?
Accessors alter data when you retrieve it from a model (e.g., formatting dates).
Mutators alter data before it is saved to the database (e.g., hashing a password).
They help standardize data formatting globally.
*/
// public function getFirstNameAttribute($value) { return ucfirst($value); }


/*
27. EAGER LOADING VS LAZY LOADING
Lazy loading queries related data only when accessed, leading to the "N+1 query problem".
Eager loading fetches all required related models in just 1 or 2 queries upfront.
Use the with() method to eager load and significantly improve performance.
*/
// User::with('posts')->get(); // Eager Loading


/*
28. WHAT ARE API RESOURCES IN LARAVEL?
API Resources act as a transformation layer for your JSON responses.
They let you control exactly which model attributes are returned to the API client.
Helps hide sensitive data and formats responses consistently.
*/
// class UserResource extends JsonResource { return ['name' => $this->name]; }


/*
29. ROUTE MODEL BINDING
Instead of passing an ID to a controller and querying the database manually...
Laravel automatically injects the model instance directly into your route/controller
 if the type-hint matches the route segment.
Returns a 404 automatically if the model is not found.
*/
// Route::get('/users/{user}', function (User $user) { return $user->name; });


/*
30. HOW TO OPTIMIZE LARAVEL PERFORMANCE
Cache configurations, routes, and views using artisan commands (config:cache, route:cache).
Use Eager Loading to solve N+1 problems.
Use Queues for time-consuming tasks (emails, processing).
Use Redis or Memcached for caching heavy database queries.
*/
// php artisan optimize


/*
========================================
ESSENTIAL LARAVEL & COMPOSER COMMANDS
========================================
*/

/*
COMPOSER COMMANDS
----------------------------------------
composer create-project laravel/laravel app-name   // Create a new Laravel project
composer install                                   // Install dependencies from composer.json
composer update                                    // Update all dependencies to latest versions
composer require package/name                      // Install a new package
composer dump-autoload                             // Regenerate the list of all classes that need to be included
*/

/*
BASIC ARTISAN COMMANDS
----------------------------------------
php artisan install:api

php artisan serve                                  // Start the local development server
php artisan list                                   // List all available artisan commands
php artisan help [command]                         // Show help for a specific command
php artisan tinker                                 // Open an interactive shell for the application
php artisan optimize:clear                         // Clear all cached files (config, routes, views)
php artisan key:generate                           // Generate the application key (APP_KEY in .env)
*/

/*
DATABASE & MIGRATION COMMANDS
----------------------------------------
php artisan make:migration create_users_table      // Create a new migration file
php artisan migrate                                // Run all pending migrations
php artisan migrate:rollback                       // Rollback the last database migration
php artisan migrate:fresh                          // Drop all tables and re-run all migrations
php artisan migrate:fresh --seed                   // Drop all tables, run all migrations and seed database
php artisan db:seed                                // Run the database seeders
*/

/*
MAKE COMMANDS (GENERATORS)
----------------------------------------
php artisan make:controller UserController         // Create a basic controller
php artisan make:controller UserController --api   // Create an API controller
php artisan make:model Post -m                     // Create a model along with a migration file (-m)
php artisan make:model Post -mc                    // Create model, migration, and controller
php artisan make:middleware CheckAdmin             // Create a new middleware
php artisan make:request StoreUserRequest          // Create a form request validation class
php artisan make:seeder UserSeeder                 // Create a new database seeder
php artisan make:factory UserFactory               // Create a new model factory
*/

/*
ROUTE COMMANDS
----------------------------------------
php artisan route:list                             // List all registered routes
php artisan route:clear                            // Clear the route cache
*/


/*
========================================
END OF FILE
========================================
*/
