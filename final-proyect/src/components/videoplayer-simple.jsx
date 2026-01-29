import { useState } from 'react';

const VideoPlayer = ({ type, tmdbId, season = 1, episode = 1 }) => {
    const [loading, setLoading] = useState(true);

    const getEmbedUrl = () => {
        if (type === 'movie') {
            return `https://vidsrc-embed.ru/embed/movie/${tmdbId}`;
        } else if (type === 'tv') {
            return `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`;
        }
        return '';
    };

    return (
        <div className="relative w-full">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <p className="text-white text-sm font-medium">Cargando película...</p>
                    </div>
                </div>
            )}
            <iframe
                src={getEmbedUrl()}
                className="w-full aspect-video rounded-xl"
                frameBorder="0"
                allowFullScreen
                onLoad={() => setLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
};

export default VideoPlayer;