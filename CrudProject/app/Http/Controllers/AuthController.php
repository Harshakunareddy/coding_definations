<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use App\Services\PaymentService;

class AuthController extends Controller
{
    /**
     * Topic: User Registration (Signup)
     * Creates a new user and issues a Bearer Token.
     */
    public function signup(Request $request)
    {
        // 1. Validate request
        // 'unique:users' ensures the email isn't already taken
        // 'confirmed' means it expects a 'password_confirmation' field in the request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Create the user
        // We use Hash::make() to encrypt the password before saving to the database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Generate Bearer Token for the new user
        // This automatically logs them in upon successful registration
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201); // 201 Created status code
    }
    /**
     * Topic 1 & 2: Auth and Bearer Token
     * Authenticates a user and issues a Bearer Token.
     */
    public function login(Request $request)
    {
        // 1. Validate request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Find user
        $user = User::where('email', $request->email)->first();

        // 3. Authenticate (check password)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 4. Generate Bearer Token (using Laravel Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Topic 3 & 4: Route Middleware & Cache (Redis)
     * Retrieves the user profile, demonstrating caching.
     */
    public function profile(Request $request)
    {
        // $request->user() gets the authenticated user. 
        // This relies on the route being protected by middleware (e.g., auth:sanctum)
        $user = $request->user();

        // 5. Cache & Redis
        // We define a unique cache key for this user
        $cacheKey = 'user_profile_' . $user->id;

        // Cache::remember tries to get the value from Cache (e.g., Redis). 
        // If it doesn't exist, it runs the function, stores the result for 60 seconds, and returns it.
        $profileData = Cache::remember($cacheKey, 60, function () use ($user) {
            // Imagine this takes a long time (e.g., fetching relations, external API)
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'cached_at' => now()->toDateTimeString(),
            ];
        });

        return response()->json([
            'message' => 'Profile retrieved successfully',
            'data' => $profileData
        ]);
    }

    /**
     * Topic: Dependency Injection
     * Example of using the PaymentService inside this controller.
     */
    public function checkout(Request $request, PaymentService $paymentService)
    {
        // 1. Get the amount the user wants to pay (e.g. from the request)
        // Defaulting to 500 rupees if not provided
        $amount = $request->input('amount', 500); 
        
        // 2. Generate a unique receipt ID for your database
        $receiptId = 'receipt_' . time();
        
        // 3. Use the injected service to create the Razorpay order
        $orderResponse = $paymentService->createOrder($amount, $receiptId);
        
        if (!$orderResponse['success']) {
            return response()->json([
                'message' => 'Failed to create order', 
                'error' => $orderResponse['error']
            ], 500);
        }
        
        return response()->json([
            'message' => 'Order created successfully',
            'order_id' => $orderResponse['order_id'],
            'amount_in_paise' => $orderResponse['amount']
        ]);
    }
}
