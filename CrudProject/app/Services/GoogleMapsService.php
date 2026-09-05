<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    protected $apiKey;
    protected $baseUrl = 'https://maps.googleapis.com/maps/api';

    public function __construct()
    {
        // 1. Add this to your .env: GOOGLE_MAPS_API_KEY=your_api_key_here
        $this->apiKey = env('GOOGLE_MAPS_API_KEY');
    }

    /**
     * Example 1: Geocoding (Address to Lat/Lng)
     * Converts a human-readable address into geographic coordinates.
     */
    public function getCoordinatesFromAddress(string $address)
    {
        // Laravel's Http facade makes API requests incredibly easy
        $response = Http::get("{$this->baseUrl}/geocode/json", [
            'address' => $address,
            'key' => $this->apiKey
        ]);

        // Check if the HTTP request was successful AND Google returned an 'OK' status
        if ($response->successful() && $response->json('status') === 'OK') {
            $results = $response->json('results');

            // Get the first result's geometry (latitude and longitude)
            $location = $results[0]['geometry']['location'];

            return [
                'success' => true,
                'lat' => $location['lat'],
                'lng' => $location['lng'],
                'formatted_address' => $results[0]['formatted_address']
            ];
        }

        return [
            'success' => false,
            'message' => 'Could not find the address'
        ];
    }

    /**
     * Example 2: Distance Matrix
     * Calculates the driving distance and time between two points.
     */
    public function calculateDistance(string $origin, string $destination)
    {
        $response = Http::get("{$this->baseUrl}/distancematrix/json", [
            'origins' => $origin,
            'destinations' => $destination,
            'mode' => 'driving', // Can also be 'walking', 'bicycling', 'transit'
            'key' => $this->apiKey
        ]);

        if ($response->successful() && $response->json('status') === 'OK') {
            $elements = $response->json('rows')[0]['elements'][0];

            if ($elements['status'] === 'OK') {
                return [
                    'success' => true,
                    'distance' => $elements['distance']['text'], // e.g., "15.2 km"
                    'duration' => $elements['duration']['text'], // e.g., "30 mins"
                ];
            }
        }

        return [
            'success' => false,
            'message' => 'Could not calculate distance'
        ];
    }
}
