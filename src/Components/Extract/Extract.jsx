import React, { useState, useRef } from "react";
import "./Extract.css";

const Extract = () => {
    // --- State Variables ---
    const [selectedImage, setSelectedImage] = useState(null);             // Image to extract watermark from
    const [extractedWatermark, setExtractedWatermark] = useState(null);   // Final extracted watermark
    const [loading, setLoading] = useState(false);                        // Loading indicator during extraction
    const [errorMessage, setErrorMessage] = useState(null);               // Error messages
    const [successMessage, setSuccessMessage] = useState(null);           // Success feedback

    const imageInputRef = useRef(null); // File input ref for image selection

    // --- Show success notification ---
    const showSuccessToast = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    // --- Show error notification ---
    const showErrorToast = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(null), 5000);
    };

    // --- Handle drag and drop file selection ---
    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            setErrorMessage(null);
        } else {
            showErrorToast("Please upload a valid image file.");
        }
    };

    // --- Handle file selection via file input ---
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            setErrorMessage(null);
        } else {
            showErrorToast("Please upload a valid image file.");
        }
    };

    // --- Send image to backend and extract watermark ---
    const handleExtract = async () => {
        if (!selectedImage) {
            showErrorToast("Please select an embedded image.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        setExtractedWatermark(null); // Clear previous result

        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
            const response = await fetch("http://127.0.0.1:5000/extract", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                const msg = errorData?.error || "Failed to extract watermark.";
                showErrorToast(msg);
                return;
            }

            const blob = await response.blob();
            const extractedImageUrl = URL.createObjectURL(blob);
            setExtractedWatermark(extractedImageUrl);
            showSuccessToast("Watermark extracted successfully!");
        } catch (error) {
            console.error("Error extracting watermark:", error);
            showErrorToast(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="extract">
            <div className="extract-content">
                {/* Feedback Messages */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* --- Upload Area --- */}
                <div className="upload-form">
                    <div
                        className="drag-area"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => imageInputRef.current.click()}
                    >
                        <p>{selectedImage ? 'Image Selected ✅' : 'Drag & drop or click to select embedded image'}</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Extract Button */}
                    <button
                        className="embed-button full-width"
                        onClick={handleExtract}
                        disabled={loading}
                    >
                        {loading ? "Extracting..." : "Extract"}
                    </button>
                </div>

                {/* --- Preview Section --- */}
                <div className="preview-container">
                    {selectedImage && (
                        <div className="preview">
                            <h4>Selected Image</h4>
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                        </div>
                    )}
                    {extractedWatermark && (
                        <div className="preview">
                            <h4>Extracted Watermark</h4>
                            <img src={extractedWatermark} alt="Extracted Watermark" />
                            <a
                                href={extractedWatermark}
                                download="extracted_watermark.png"
                                className="download-link"
                            >
                                Download Extracted Watermark
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Extract;
