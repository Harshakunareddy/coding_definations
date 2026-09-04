/*
========================================
PHP INTERVIEW QUESTIONS (1–40)
WITH PROPER EXPLANATIONS (SPEAKABLE)
========================================
*/

/*
1. WHAT IS PHP?
PHP is a popular server-side scripting language used for web development.
It stands for PHP: Hypertext Preprocessor.
It can be embedded into HTML and interacts well with databases like MySQL.
*/
<?php echo "Hello PHP"; ?>


/*
2. ECHO VS PRINT
Both are used to output data to the screen.
echo is slightly faster and does not return any value.
print returns 1, so it can be used in expressions.
*/
// echo "Fast";
// print "Returns 1";


/*
3. ISSET VS EMPTY
isset checks if a variable is declared and not null.
empty checks if a variable is empty (like 0, "", null, false).
They are widely used for form validation.
*/
// isset($var);
// empty($var);


/*
4. REQUIRE VS INCLUDE
Both are used to include a file into another file.
include gives a warning (E_WARNING) if file is missing, but execution
continues.
require gives a fatal error (E_COMPILE_ERROR) and stops execution.
*/
// include 'file.php';
// require 'file.php';


/*
5. SESSION VS COOKIE
Sessions store user data on the server securely.
Cookies store data in the user's browser and are sent with every request.
Sessions end when browser closes, cookies can have an expiry date.
*/
// $_SESSION['user'] = "Harsha";
// setcookie("user", "Harsha", time() + 3600);


/*
6. GET VS POST
GET sends data in the URL, visible to everyone (not secure for passwords).
POST sends data in HTTP body, hidden and secure.
GET is for retrieving data, POST is for submitting data.
*/
// $_GET['id'];
// $_POST['password'];


/*
7. MAGIC METHODS
Magic methods are special methods in classes that start with double underscore.
They are executed automatically in certain situations.
Examples: __construct(), __destruct(), __get(), __set().
*/
// public function __construct() { echo "Init"; }


/*
8. OOP IN PHP
PHP supports Object-Oriented Programming (Classes, Objects, Inheritance).
It helps organize code and makes it reusable.
Classes are templates, objects are instances.
*/
// class User { }
// $user = new User();


/*
9. STATIC KEYWORD
Static properties or methods belong to the class itself, not objects.
You can call them directly without creating an object.
Uses self:: instead of $this.
*/
// class Math { public static $pi = 3.14; }
// echo Math::$pi;


/*
10. INTERFACE VS ABSTRACT CLASS
Interface = "A Rulebook / Contract". It tells you WHAT to do, not HOW.
(Empty rules, you can sign multiple interfaces).
Abstract Class = "A Half-Built House". It gives you some real code, but leaves empty spaces for you to finish.
(Half-written code, you can only inherit from one abstract class).
*/
// interface Camera { public function takePhoto(); }
// abstract class Vehicle { public function startEngine() { echo "Vroom"; } }
// 1. The Rulebook (Interface)
interface Camera {
public function takePhoto(); // Notice there is no { body } here!
}

// 2. Class 1 signs the contract
class iPhone implements Camera {
// This is where the actual code goes!
public function takePhoto() {
echo "Taking a high-quality photo with the Apple Lens...";
}
}

// 3. Class 2 signs the same contract
class Samsung implements Camera {
// This is where the actual code goes!
public function takePhoto() {
echo "Taking a 100x zoom photo with the Galaxy Lens...";
}
}

function captureMoment(Camera $device) {
// We don't care if it's an iPhone or a Samsung,
// we just know it signed the Camera contract, so this will work:
$device->takePhoto();
}






/*
11. PDO VS MYSQLI
PDO supports 12 different databases.
MySQLi supports only MySQL databases.
PDO is preferred because it is more flexible for future changes.
*/
// $pdo = new PDO($dsn, $user, $pass);


/*
12. NAMESPACES
Namespaces prevent name collisions between classes.
It is like grouping files in folders.
Required in modern PHP frameworks.
*/
// namespace App\Models;
// class User { }


/*
13. COMPOSER
Composer is a dependency manager for PHP.
It installs and updates third-party libraries.
Maintains dependencies in composer.json.
*/
// composer require vendor/package


/*
14. TRAITS
PHP only supports single inheritance.
Traits allow code reuse across multiple independent classes.
Use 'use' keyword inside the class to include a trait.
*/
// trait Logger { public function log() { } }
// class App { use Logger; }


/*
15. EXCEPTIONS
Exceptions are used to handle runtime errors gracefully.
We use try block for risky code and catch block for errors.
Prevents the application from crashing abruptly.
*/
// try { throw new Exception("Error"); } catch (Exception $e) { }


/*
16. FOREACH LOOP
foreach is specifically designed for iterating over arrays and objects.
It is simpler and safer than for loop for arrays.
Can access both key and value easily.
*/
// foreach ($arr as $key => $val) { }


/*
17. PHP.INI
php.ini is the main configuration file for PHP.
It controls settings like upload limits, error reporting, memory limits.
Changes require a server restart.
*/
// upload_max_filesize = 2M


/*
18. ARRAY FUNCTIONS
PHP has many built-in array functions.
array_merge combines arrays, array_push adds elements.
array_map applies a callback to array elements.
*/
// array_push($arr, 1);


/*
19. ERROR REPORTING
Error reporting controls which errors are shown.
Helps in debugging during development.
Should be turned off in production for security.
*/
// error_reporting(E_ALL);


/*
20. MVC PATTERN
MVC stands for Model, View, Controller.
Model handles data, View handles UI, Controller handles logic.
Separates code for better maintenance and scalability.
*/
// Model <-> Controller <-> View


        /*
        21. DIFFERENCE BETWEEN == AND ===
        == checks if values are equal after type juggling (loose comparison).
        === checks if both values and their data types are exactly equal (strict comparison).
        Always prefer === in PHP to avoid unexpected logical bugs.
        */
        // var_dump(0 == "0"); // true
        // var_dump(0 === "0"); // false


        /*
        22. HOW TO PREVENT SQL INJECTION
        SQL Injection is prevented by using Prepared Statements.
        Instead of directly passing variables to SQL, we use placeholders (?) and bind parameters.
        PDO and MySQLi both support prepared statements.
        */
        // $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        // $stmt->execute([$email]);


        /*
        23. INCLUDE_ONCE VS REQUIRE_ONCE
        They are similar to include and require but ensure the file is included only once.
        Even if you call them multiple times, PHP will ignore subsequent calls.
        Useful for config files or defining functions/classes to avoid "already defined" errors.
        */
        // include_once 'config.php';
        // require_once 'config.php';


        /*
        24. MAGIC CONSTANTS
        Magic constants are predefined constants in PHP that change based on where they are used.
        They start and end with double underscores.
        Examples: __FILE__, __LINE__, __DIR__, __CLASS__, __METHOD__.
        */
        // echo "Current file: " . __FILE__;


        /*
        25. HOW TO HANDLE FILE UPLOADS IN PHP
        When a file is uploaded via a form (enctype="multipart/form-data"), it goes to a temporary folder.
        PHP stores the file info in the $_FILES superglobal array.
        We use move_uploaded_file() to save it to our desired directory.
        */
        // move_uploaded_file($_FILES["file"]["tmp_name"], "uploads/image.png");


        /*
        26. WHAT IS A CLOSURE IN PHP?
        A Closure is an anonymous function (a function without a name).
        It can capture variables from the outside scope using the 'use' keyword.
        Often used as callbacks in array functions.
        */
        // $message = "Hello";
        // $greet = function($name) use ($message) { echo "$message $name"; };


        /*
        27. WHAT IS THE USE OF FINAL KEYWORD?
        The 'final' keyword prevents a class from being inherited.
        If applied to a method, it prevents that method from being overridden in child classes.
        Provides security and prevents modification of core logic.
        */
        // final class CoreEngine { }
        // // class App extends CoreEngine { } // Fatal error


        /*
        28. ARRAY_MERGE VS + OPERATOR
        Both combine arrays, but they handle duplicate keys differently.
        array_merge() overrides the first array's string keys with the second array's.
        The + operator keeps the first array's keys and ignores the second's duplicates.
        */
        // $arr = ['a' => 1] + ['a' => 2]; // Result: ['a' => 1]


        /*
        29. HOW TO SET AND DESTROY A SESSION
        session_start() must be called at the very top of the script.
        We set session variables using the $_SESSION array.
        To destroy, we unset the variables and call session_destroy().
        */
        // session_start();
        // $_SESSION['user_id'] = 5;
        // session_destroy();


        /*
        30. HOW TO DO PASSWORD HASHING
        Never store plain text passwords in databases.
        Use password_hash() to create a strong hash (usually bcrypt).
        Use password_verify() to check if the entered password matches the hash.
        */
        // $hash = password_hash("myPass123", PASSWORD_DEFAULT);
        // $isValid = password_verify("myPass123", $hash);

        /*
        31. REVERSE A STRING
        Reverses a given string using PHP built-in function or manually.
        */
        function stringReverse($str) { return strrev($str); }
        echo stringReverse("hvre");


        /*
        32. SWAP TWO NUMBERS USING THIRD VARIABLE
        Swapping two values using a temporary variable.
        */
        function swapWithThird($a, $b) {
        $temp = $a;
        $a = $b;
        $b = $temp;
        return [$a, $b];
        }


        /*
        33. CHECK IF STRING IS PALINDROME
        Checks if a string reads the same forwards and backwards.
        */
        function palindromeOrNot($str) { return $str === strrev($str); }


        /*
        34. FIND LARGEST NUMBER IN ARRAY
        Finds the maximum value in an array.
        */
        function largestNumberInArray($arr) { return max($arr); }


        /*
        35. REMOVE DUPLICATES FROM ARRAY
        Removes duplicate values from an array using array_unique.
        */
        function removeDuplicatesFromArray($arr) { return array_unique($arr); }


        /*
        36. REMOVE DUPLICATES WITHOUT BUILT-IN
        Removes duplicates by keeping a tracking array of seen values.
        */
        function removeDuplicatesWithoutBuiltIn($arr) {
        $seen = [];
        $result = [];
        foreach ($arr as $val) {
        if (!isset($seen[$val])) {
        $seen[$val] = true;
        $result[] = $val;
        }
        }
        return $result;
        }


        /*
        37. COUNT OCCURRENCE OF CHARACTERS
        Counts how many times each character appears in a string.
        */
        function countOccurrenceOfChars($str) {
        $count = [];
        foreach (str_split($str) as $char) {
        $count[$char] = isset($count[$char]) ? $count[$char] + 1 : 1;
        }
        return $count;
        }


        /*
        38. CHECK IF NUMBER IS PRIME
        Checks if a number is only divisible by 1 and itself.
        */
        function primeOrNot($num) {
        if ($num < 2) return false; for ($i=2; $i <=sqrt($num); $i++) { if ($num % $i==0) return false; } return true; }
            /* 39. FACTORIAL OF A NUMBER Calculates the product of all positive integers less than or equal to n. */
            function factorialOfNumber($num) { $result=1; for ($i=1; $i <=$num; $i++) { $result *=$i; } return $result;
            } /* 40. SEPARATE EVEN AND ODD NUMBERS Filters an array into even and odd numbers. */ function
            evenAndOddNumbers($arr) { $even=array_filter($arr, fn($n)=> $n % 2 == 0);
            $odd = array_filter($arr, fn($n) => $n % 2 != 0);
            return ['even' => $even, 'odd' => $odd];
            }


            /*
            ========================================
            END OF FILE
            ========================================
            */