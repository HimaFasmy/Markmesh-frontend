import React, { useState } from 'react';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Embed from './Components/Embed/Embed';
import Extract from './Components/Extract/Extract';
import Verify from './Components/Verify/Verify';
import Navbar from './Components/Navbar/Navbar';

const App = () => {
    // State to manage the current page
    const [currentPage, setCurrentPage] = useState('login');

    // Function to handle successful login
    const handleLogin = () => {
        setCurrentPage('home'); // Redirect to home page after login
    };

    // Function to render the appropriate page based on the currentPage state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home setCurrentPage={setCurrentPage} />; // Render Home page
            case 'embed':
                return <Embed />; // Render Embed page
            case 'extract':
                return <Extract />; // Render Extract page
            case 'verify':
                return <Verify />; // Render Contact page
            case 'signup':
                return <LoginSignup onLogin={handleLogin} />; // Render Signup page
            case 'login':
            default:
                return <LoginSignup onLogin={handleLogin} />; // Render Login page
        }
    };

    return (
        <div>
            {/* Render Navbar component only if not on login or signup page */}
            {(currentPage !== 'login' && currentPage !== 'signup') && (
                <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            )}
            {/* Render the page based on currentPage state */}
            {renderPage()}
        </div>
    );
};

export default App;
