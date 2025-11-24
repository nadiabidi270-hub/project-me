
import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onClear: () => void;
    existingSignature?: string;
    label: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClear, existingSignature, label }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        if (existingSignature && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx?.drawImage(img, 0, 0);
                setHasSignature(true);
            };
            img.src = existingSignature;
        }
    }, [existingSignature]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        if (!hasSignature) setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        saveSignature();
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    const saveSignature = () => {
        if (canvasRef.current) {
            const dataUrl = canvasRef.current.toDataURL();
            onSave(dataUrl);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
            onClear();
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="bg-white border border-gray-300 rounded cursor-crosshair touch-none w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Draw your signature above</span>
                <button 
                    type="button" 
                    onClick={clearCanvas} 
                    className="text-red-600 hover:text-red-800 font-medium"
                >
                    Clear Signature
                </button>
            </div>
        </div>
    );
};
