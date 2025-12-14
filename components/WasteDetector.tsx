import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Scan, Recycle, Leaf, Trash2, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { analyzeWasteImage, WasteAnalysisResult } from '../services/geminiService';

const WasteDetector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Manage Camera Stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (isCameraOpen) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
          }
        } catch (err) {
          console.error("Camera access error:", err);
          setError("Unable to access camera. Please check permissions.");
          setIsCameraOpen(false);
        }
      };

      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Convert to JPEG directly
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        setIsCameraOpen(false);
        setResult(null);
        setError(null);
      }
    }
  };

  const convertImageToJpeg = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
        }
        // Fill white background for non-transparent JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error("Failed to load image for conversion"));
      img.src = src;
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Detect MIME type and convert if necessary (e.g. AVIF to JPEG)
        const mimeType = dataUrl.split(';')[0].split(':')[1];
        
        if (mimeType === 'image/avif') {
          try {
            const jpegUrl = await convertImageToJpeg(dataUrl);
            setImage(jpegUrl);
          } catch (conversionError) {
            console.error(conversionError);
            setImage(dataUrl);
            setError("Warning: Image format might not be supported. JPEG or PNG recommended.");
          }
        } else {
          setImage(dataUrl);
        }

        setResult(null);
        setError(null);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process uploaded image.");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract base64 data (remove "data:image/jpeg;base64," prefix)
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const analysisResult = await analyzeWasteImage(base64Data, mimeType);
      setResult(analysisResult);
    } catch (err) {
      setError("Failed to analyze image. Please try again or use a clearer image.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-2">
          Waste Detection System .gpt.ai
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Upload an image or take a photo of any waste item. Our deep learning model will identify it, 
          classify it, and guide you on the proper recycling procedure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload/Camera Section */}
        <div className="space-y-4">
          <div 
            className={`relative border-2 border-dashed rounded-2xl transition-all h-80 flex flex-col items-center justify-center overflow-hidden ${
              image || isCameraOpen ? 'border-pink-500 bg-pink-50/30 p-0' : 'border-slate-300 hover:border-pink-400 hover:bg-slate-50 p-8'
            }`}
          >
            {isCameraOpen ? (
              <div className="relative w-full h-full bg-black flex flex-col">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-6 z-10">
                  <button 
                    onClick={() => setIsCameraOpen(false)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                    title="Cancel"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={capturePhoto}
                    className="p-1 rounded-full border-4 border-white/50 hover:border-white transition-all"
                  >
                     <div className="w-14 h-14 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
            ) : image ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img 
                  src={image} 
                  alt="Waste to analyze" 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                />
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Upload Waste Image</h3>
                <p className="text-sm text-slate-500 mt-2 mb-6">PNG, JPG up to 5MB</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                  >
                    Select File
                  </button>
                  <button 
                    onClick={() => setIsCameraOpen(true)}
                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors flex items-center"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </button>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {!isCameraOpen && (
            <button
              onClick={handleAnalyze}
              disabled={!image || isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all ${
                !image 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : isLoading 
                    ? 'bg-pink-500/80 text-white cursor-wait'
                    : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:shadow-pink-500/25 hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <Scan className="w-6 h-6 mr-2 animate-pulse" />
                  Analyzing Waste...
                </>
              ) : (
                <>
                  <Scan className="w-6 h-6 mr-2" />
                  Identify Waste
                </>
              )}
            </button>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[320px]">
              <Recycle className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-400">Analysis Results</h3>
              <p className="text-sm text-slate-400 max-w-xs mt-2">
                Results will appear here after the AI processes your image.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse min-h-[320px]">
              <div className="w-full space-y-4">
                <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                <div className="h-32 bg-slate-100 rounded-xl mt-8"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-500 ease-out">
              <div className={`p-6 ${
                result.category === 'Organic' ? 'bg-pink-50 border-b border-pink-100' : 'bg-blue-50 border-b border-blue-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.category === 'Organic' ? 'bg-pink-200 text-pink-800' : 'bg-blue-200 text-blue-800'
                  }`}>
                    {result.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 capitalize mb-1">{result.wasteName}</h2>
                <p className="text-slate-600 font-medium">{result.materialType}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center">
                    <Recycle className="w-4 h-4 mr-2" />
                    Recycling Procedure
                  </h3>
                  <div className="space-y-3">
                    {result.recyclingSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-center">
                    {result.category === 'Organic' ? (
                       <Leaf className="w-8 h-8 text-pink-500 mb-2" />
                    ) : (
                       <Trash2 className="w-8 h-8 text-blue-500 mb-2" />
                    )}
                    <span className="text-xs text-slate-500 font-semibold">Bin Color</span>
                    <span className={`font-bold ${
                      result.category === 'Organic' ? 'text-pink-600' : 'text-blue-600'
                    }`}>
                       {result.category === 'Organic' ? 'Green Bin' : 'Blue/Yellow Bin'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-8 h-8 text-teal-500 mb-2" />
                    <span className="text-xs text-slate-500 font-semibold">Recyclable?</span>
                    <span className="font-bold text-teal-600">
                      Yes, Check Local
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteDetector;