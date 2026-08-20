import React, { useState, useRef, useEffect } from 'react';
import InputError from '@/Components/InputError';

export default function PhotoUpload({ existingPhotoUrl, onPhotoChange, errorMessage }) {
    const [previewUrl, setPreviewUrl] = useState(existingPhotoUrl || null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        setPreviewUrl(existingPhotoUrl || null);
    }, [existingPhotoUrl]);

    // Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onPhotoChange(file);
        }
    };

    // Open Camera Modal
    const startCamera = async () => {
        setIsCameraOpen(true);
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 640 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (err) {
            setCameraError('Kamera tidak dapat diakses. Pastikan Anda telah memberikan izin.');
            console.error(err);
        }
    };

    // Stop Camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    // Capture Photo
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to Blob and then to File
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                    onPhotoChange(file);
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 mb-6">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Pas Foto Calon Murid</h4>
            
            <div className="relative group">
                {/* Image Preview Container */}
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-all duration-300 ${!previewUrl ? 'border-dashed' : ''}`}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs font-medium">3x4 / 4x6</span>
                        </div>
                    )}
                </div>

                {/* Overlay Hover Actions (Desktop) */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2 backdrop-blur-sm hidden md:flex">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Upload
                    </button>
                    <button 
                        type="button"
                        onClick={startCamera}
                        className="text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Kamera
                    </button>
                </div>
            </div>

            {/* Mobile Actions (Visible on small screens) */}
            <div className="flex space-x-2 md:hidden">
                 <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                >
                    Pilih File
                </button>
                <button 
                    type="button"
                    onClick={startCamera}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                >
                    Kamera
                </button>
            </div>

            <InputError message={errorMessage} className="mt-1 text-center" />

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/jpg" 
                onChange={handleFileChange} 
            />

            {/* Camera Modal */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl w-full max-w-md shadow-2xl relative">
                        <button 
                            type="button"
                            onClick={stopCamera}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10 bg-white/50 dark:bg-black/50 rounded-full p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 className="text-lg font-bold text-center mb-4 text-slate-800 dark:text-white">Ambil Foto</h3>
                        
                        {cameraError ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center mb-4 border border-red-100">
                                {cameraError}
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square mb-4 shadow-inner">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                                
                                {/* Overlay guides */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-48 h-64 border-2 border-white/40 border-dashed rounded-lg"></div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-center">
                            {!cameraError && (
                                <button 
                                    type="button"
                                    onClick={capturePhoto}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-200 hover:scale-105 transition-transform"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
