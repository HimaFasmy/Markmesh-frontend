import React, { useState, useRef } from 'react';
import './Embed.css';

const Embed = () => {
    // --- State Variables ---
    const [selectedImage, setSelectedImage] = useState(null);             // Original image to be watermarked
    const [selectedWatermark, setSelectedWatermark] = useState(null);     // Watermark image
    const [embeddedImage, setEmbeddedImage] = useState(null);             // Final watermarked image
    const [errorMessage, setErrorMessage] = useState(null);               // Display error messages
    const [successMessage, setSuccessMessage] = useState(null);           // Display success feedback
    const [isLoading, setIsLoading] = useState(false);                    // Loading indicator during request

    // Refs for file input clicks
    const imageInputRef = useRef(null);
    const watermarkInputRef = useRef(null);

    // --- Show success message with auto-dismiss ---
    const showSuccessToast = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    // --- Handle drag & drop files ---
    const handleFileDrop = (e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        if (type === 'image') setSelectedImage(file);
        if (type === 'watermark') setSelectedWatermark(file);
    };

    // --- Submit to backend for watermark embedding ---
    const handleEmbed = async () => {
        if (!selectedImage || !selectedWatermark) {
            setErrorMessage('Please select both an image and a watermark.');
            return;
        }

        setErrorMessage(null);
        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('watermark', selectedWatermark);

        try {
            const response = await fetch('http://localhost:5001/embed', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage(errorText);
                throw new Error(errorText || 'Failed to embed watermark.');
            }

            const blob = await response.blob();
            const embeddedImageUrl = URL.createObjectURL(blob);
            setEmbeddedImage(embeddedImageUrl);
            showSuccessToast('Watermark embedded successfully!');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="embed">
            <div className="embed-content">
                {/* Toast and Error Messages */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* --- Upload Section --- */}
                <div className="upload-form">
                    {/* Upload Cover Image */}
                    <div
                        className="drag-area"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleFileDrop(e, 'image')}
                        onClick={() => imageInputRef.current.click()}
                    >
                        <p>{selectedImage ? 'Image Selected ✅' : 'Drag & drop or click to select an image'}</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                        />
                    </div>

                    {/* Upload Watermark */}
                    <div
                        className="drag-area"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleFileDrop(e, 'watermark')}
                        onClick={() => watermarkInputRef.current.click()}
                    >
                        <p>{selectedWatermark ? 'Watermark Selected ✅' : 'Drag & drop or click to select watermark'}</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={watermarkInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => setSelectedWatermark(e.target.files[0])}
                        />
                    </div>

                    {/* Embed Button */}
                    <button
                        className="embed-button full-width"
                        onClick={handleEmbed}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Embedding...' : 'Embed'}
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
                    {selectedWatermark && (
                        <div className="preview">
                            <h4>Selected Watermark</h4>
                            <img src={URL.createObjectURL(selectedWatermark)} alt="Watermark" />
                        </div>
                    )}
                    {embeddedImage && (
                        <div className="preview">
                            <h4>Embedded Image</h4>
                            <img src={embeddedImage} alt="Embedded" />
                            <a
                                href={embeddedImage}
                                download="embedded_image.png"
                                className="download-link"
                            >
                                Download Embedded Image
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Embed;
