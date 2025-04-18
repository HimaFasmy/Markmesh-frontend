import React from 'react';
import './Home.css';

const Home = ({ setCurrentPage }) => {
    return (
        <div className="home">
            {/* --- Hero Section --- */}
            <header className="hero">
                <h1>Protect Your Images with MarkMesh</h1>
                <p>Secure, watermark, and verify your digital images with ease.</p>

                {/* CTA Buttons to navigate to embedding or extraction */}
                <div className="hero-buttons">
                    <button onClick={() => setCurrentPage('embed')}>Embed Watermark</button>
                    <button onClick={() => setCurrentPage('extract')}>Extract Watermark</button>
                </div>

                {/* Trust indicators for credibility */}
                <div className="hero-trust">
                    <span>Trusted by 10,000+ users</span>
                    <span>Fast. Secure. Reliable.</span>
                </div>

                {/* Scroll indicator to encourage discovery */}
                <div className="scroll-down">↓ Scroll to learn more</div>
            </header>

            {/* --- How It Works Section --- */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-container">
                    {/* Step 1 */}
                    <div className="step-card">
                        <h3>1. Upload</h3>
                        <p>Choose an image or watermark to begin the process.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="step-card">
                        <h3>2. Embed / Extract</h3>
                        <p>Embed a custom watermark or extract an existing one securely.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="step-card">
                        <h3>3. Save</h3>
                        <p>Download the processed image or verify its authenticity.</p>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="footer">
                <p>
                    Need help? <a href="mailto:support@example.com">Contact Support</a>
                </p>
                <p>© 2024 MarkMesh</p>
            </footer>
        </div>
    );
};

export default Home;
