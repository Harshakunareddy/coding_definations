@extends('layouts.app')


<html>
<nav style="background-color: black; color: white; padding: 10px; position: fixed; 
    width: 100%; height: 100px; top: 0; z-index: 1;">
    <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>

<div style="color: red; padding: 10px;">

</div>

</html>


<html>

<footer>
    <p style="background-color: black; color: white; position: fixed; width: 100%; bottom:0px; height: 200px;">
        Copyright &copy;
        2026 All rights reserved
    </p>
</footer>

</html>



<html>
<div style="display: flex; flex-direction: column; align-items: center; 
    justify-content: center; position: fixed; left: 0;">
    <div id="hamburger" style="background-color: black; color: white; padding: 10px;">
        <span style="display: block; width: 30px; height: 5px; background-color: white; margin: 5px;"></span>
        <span style="display: block; width: 30px; height: 5px; background-color: white; margin: 5px;"></span>
        <span style="display: block; width: 30px; height: 5px; background-color: white; margin: 5px;"></span>
    </div>
    <ul id='menu' style="display: none;flex-direction: column; align-items: center; justify-content: center;">
        <li><a href="{{ route('home') }}">Home</a></li>
        <li><a href="{{ route('about') }}">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</div>

</html>


<script>
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    hamburger.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'none' ? 'flex' : 'none');
    });
</script>