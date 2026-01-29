import React, { useState } from "react";
import VideoPlayer from "./videoplayer-simple.jsx";

export default function Modal({ isOpen, onClose, qr, movie, trailerKey, onToggleFavorite, isFavorite, videoSource, onVideoError }) {
    const [activeTab, setActiveTab] = useState('trailer'); // 'trailer' o 'player'
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);

    if (!isOpen || !movie) return null;

    const isTV = movie.media_type === 'tv';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[1400px] max-h-[90vh] rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden flex flex-col md:flex-row shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white bg-black/60 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                    aria-label="Cerrar modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <button
                    onClick={onToggleFavorite}
                    className="absolute top-4 right-16 z-20 text-white bg-black/60 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                    aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isFavorite ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 transition-colors ${isFavorite ? "text-red-500" : "text-white"}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>


                <div className="hidden md:flex w-[280px] lg:w-[320px] flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600 flex-col items-center justify-center p-6 gap-4">
                    <h3 className="font-bold text-lg text-center text-white">
                        Escanea el QR
                    </h3>

                    {qr ? (
                        <div className="bg-white p-4 rounded-xl shadow-2xl">
                            <img src={qr} alt="Código QR" className="w-48 h-48 lg:w-56 lg:h-56"/>
                        </div>
                    ) : (
                        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl w-48 h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>


                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8 flex flex-col gap-6">

                        <div className="space-y-3">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                                {movie.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                {movie.release_date && (
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full font-medium text-gray-700 dark:text-gray-300">
                                        {new Date(movie.release_date).getFullYear()}
                                    </span>
                                )}
                                {movie.vote_average && (
                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full font-bold text-blue-700 dark:text-blue-400 uppercase text-xs">
                                    {isTV ? 'Serie' : 'Película'}
                                </span>
                            </div>

                            {movie.overview && (
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                    {movie.overview}
                                </p>
                            )}
                        </div>

                        {/* Tabs de navegación */}
                        <div className="flex gap-2 border-b border-gray-200 dark:border-neutral-700">
                            <button
                                onClick={() => setActiveTab('trailer')}
                                className={`px-6 py-3 font-bold text-sm transition-all ${
                                    activeTab === 'trailer'
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Trailer
                            </button>
                            <button
                                onClick={() => setActiveTab('player')}
                                className={`px-6 py-3 font-bold text-sm transition-all flex items-center gap-2 ${
                                    activeTab === 'player'
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                                Ver {isTV ? 'Serie' : 'Película'}
                            </button>
                        </div>


                        {activeTab === 'trailer' ? (
                            <div className="w-full">
                                <div className="w-full aspect-video rounded-xl bg-black overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 relative group">
                                    {videoSource === 'instagram' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-black">
                                            <iframe
                                                className="w-full h-full max-w-[400px] mx-auto"
                                                src={`https://www.instagram.com/p/${trailerKey}/embed/captioned/`}
                                                allowTransparency="true"
                                                allowFullScreen="true"
                                                frameBorder="0"
                                                scrolling="no"
                                                style={{ background: 'black' }}
                                            ></iframe>
                                        </div>
                                    ) : trailerKey ? (
                                        <>
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
                                                title="Trailer"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                            {/* Botón de que rico iiiii */}
                                            <button
                                                onClick={onVideoError}
                                                className="absolute bottom-4 right-4 z-30 bg-red-600/90 hover:bg-red-700 text-white text-xs px-3 py-2 rounded shadow-lg backdrop-blur flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                </svg>
                                                Click para magía
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            <p>No se encontró ningún trailer</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-4">

                                {isTV && (
                                    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                Temporada
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedSeason}
                                                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                Episodio
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedEpisode}
                                                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Reproductor de películas/series */}
                                <VideoPlayer
                                    type={isTV ? 'tv' : 'movie'}
                                    tmdbId={movie.id}
                                    season={selectedSeason}
                                    episode={selectedEpisode}
                                />

                                {/* Nota informativa */}
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        💡 El contenido se carga desde servidores externos. Si no funciona, prueba otro navegador o espera unos segundos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* QR móvil */}
                        <div className="md:hidden flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                            <h3 className="font-bold text-white text-center">
                                Escanea para ver en TMDB
                            </h3>
                            {qr ? (
                                <div className="bg-white p-4 rounded-xl shadow-2xl">
                                    <img src={qr} alt="Código QR" className="w-48 h-48"/>
                                </div>
                            ) : (
                                <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl w-48 h-48 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}