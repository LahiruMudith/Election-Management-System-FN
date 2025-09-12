import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

type SelfieCaptureProps = {
    onCapture: (file: File) => void;
    onCancel: () => void;
};

const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onCapture, onCancel }) => {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            toast.error("Failed to capture image. Please try again.");
            return;
        }
        setImgSrc(imageSrc);
        fetch(imageSrc)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                onCapture(file);
                toast.success("Selfie captured!");
            });
    };

    return (
        <div className="flex flex-col items-center justify-center" style={{ width: 520 }}>
            {!imgSrc ? (
                <>
                    <div className="flex flex-col items-center justify-center" style={{ width: 450 }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={320}
                            height={240}
                            videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="flex gap-2 mt-3">
                            <button onClick={capture} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Capture Selfie
                            </button>
                            <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img src={imgSrc} alt="Selfie" style={{ width: 320, height: 240 }} />
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => setImgSrc(null)} className="bg-gray-200 px-4 py-2 rounded">
                            Retake
                        </button>
                        <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SelfieCapture;