import React from "react";

export default function Modal({ isOpen, onClose, qr, movie, trailerKey }) {
    if (!isOpen || !movie) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-[95vw] max-w-[1400px] h-[90vh] rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden flex">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-xl text-white bg-black/50 rounded-full w-10 h-10">
                    ✕
                </button>



                <div className="w-[320px] flex-shrink-0 bg-gray-100 dark:bg-neutral-800 flex flex-col items-center justify-center p-6">
                    <h3 className="font-semibold mb-4 text-center text-white">
                        Escanea el QR
                    </h3>

                    {qr ? (
                        <img src={qr} alt="QR Code" className="w-64 h-64"/>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Generando QR...
                        </p>
                    )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-3 text-white">
                            {movie.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {movie.overview}
                        </p>
                    </div>

                    <div className="w-full aspect-video rounded-xl bg-black overflow-hidden">
                        {trailerKey ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="Trailer"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Aqui va el trailer.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

