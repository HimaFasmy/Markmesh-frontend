import React, { useState, useRef, useEffect } from 'react';
import './Verify.css';

const Verify = () => {
    // --- State Hooks ---
    const [selectedInitialWatermark, setSelectedInitialWatermark] = useState(null); // Original watermark file
    const [selectedExtractedWatermark, setSelectedExtractedWatermark] = useState(null); // Extracted watermark file
    const [verificationResult, setVerificationResult] = useState(null); // Result from server (PSNR, SSIM, etc.)
    const [loading, setLoading] = useState(false); // Spinner/loading state
    const [errorMessage, setErrorMessage] = useState(null); // Display error messages

    const resultRef = useRef(null); // Ref to scroll into result section

    // Scroll to result section on successful verification
    useEffect(() => {
        if (verificationResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [verificationResult]);

    // --- Handlers for file uploads ---
    const handleInitialWatermarkChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedInitialWatermark(file);
            setErrorMessage(null);
        } else {
            setErrorMessage("Please upload a valid image file for the initial watermark.");
        }
    };

    const handleExtractedWatermarkChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedExtractedWatermark(file);
            setErrorMessage(null);
        } else {
            setErrorMessage("Please upload a valid image file for the extracted watermark.");
        }
    };

    // --- Submit verification to backend ---
    const handleVerify = async () => {
        if (!selectedInitialWatermark || !selectedExtractedWatermark) {
            setErrorMessage("Please select both the initial and extracted watermark images.");
            return;
        }

        setErrorMessage(null);
        setVerificationResult(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('initial_watermark', selectedInitialWatermark);
        formData.append('extracted_watermark', selectedExtractedWatermark);

        try {
            const response = await fetch('http://localhost:5002/verify', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server error: ${response.status}`);
            }

            const result = await response.json();
            setVerificationResult(result);
        } catch (error) {
            setErrorMessage(error.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify">
            <div className="embed-content">

                {/* --- Upload Area --- */}
                <div className="upload-form">
                    <div
                        className="drag-area"
                        onClick={() => document.getElementById('initial-watermark-upload').click()}
                    >
                        {selectedInitialWatermark ? selectedInitialWatermark.name : "Drag & drop or click to select initial watermark"}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        id="initial-watermark-upload"
                        style={{ display: 'none' }}
                        onChange={handleInitialWatermarkChange}
                    />

                    <div
                        className="drag-area"
                        onClick={() => document.getElementById('extracted-watermark-upload').click()}
                    >
                        {selectedExtractedWatermark ? selectedExtractedWatermark.name : "Drag & drop or click to select extracted watermark"}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        id="extracted-watermark-upload"
                        style={{ display: 'none' }}
                        onChange={handleExtractedWatermarkChange}
                    />

                    {/* Error display */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    {/* Submit button */}
                    <button
                        className="embed-button full-width"
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </div>

                {/* --- Previews of Uploaded Images --- */}
                <div className="preview-container">
                    {selectedInitialWatermark && (
                        <div className="preview">
                            <h4>Initial Watermark</h4>
                            <img src={URL.createObjectURL(selectedInitialWatermark)} alt="Initial Watermark" />
                        </div>
                    )}
                    {selectedExtractedWatermark && (
                        <div className="preview">
                            <h4>Extracted Watermark</h4>
                            <img src={URL.createObjectURL(selectedExtractedWatermark)} alt="Extracted Watermark" />
                        </div>
                    )}
                </div>

                {/* --- Success Message --- */}
                {verificationResult && verificationResult.status === "Verification Successful" && (
                    <div className="success-message">
                        Verification Successful!
                    </div>
                )}

                {/* --- Results Section --- */}
                {verificationResult && (
                    <div className="result-container" ref={resultRef}>
                        <h4>Verification Result</h4>
                        <p><strong>PSNR:</strong> {verificationResult.psnr.toFixed(2)}</p>
                        <p><strong>SSIM:</strong> {verificationResult.ssim.toFixed(4)}</p>
                        <p><strong>Correlation Coefficient:</strong> {verificationResult.correlation.toFixed(4)}</p>
                        <p><strong>Status:</strong> {verificationResult.status}</p>

                        {/* Link to download PDF report */}
                        {verificationResult.downloadLink && (
                            <a
                                href={verificationResult.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-link"
                            >
                                View Verification Report
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Verify;
