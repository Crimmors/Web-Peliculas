import { useEffect, useState, useRef } from 'react';
import { ApiMovie } from "./service/api-movie.js";
import { buildUrlImage } from "./utils/buildUrlImage.js";
import Modal from "./components/modal.jsx";
import { generateQr } from "./helper/generateQr.js";

//// LISTA // --- LISTA COMPLETA DE GÉNEROS DE PELICULAS ---

const CATEGORIES = [
    { id: 'popular', name: "Para ti" },
    { id: 28, name: "Acción" },
    { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" },
    { id: 99, name: "Documental" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" },
    { id: 14, name: "Fantasía" },
    { id: 36, name: "Historia" },
    { id: 27, name: "Terror" },
    { id: 10402, name: "Música" },
    { id: 9648, name: "Misterio" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Ciencia Ficción" },
    { id: 10770, name: "Película de TV" },
    { id: 53, name: "Suspenso" },
    { id: 10752, name: "Guerra" },
    { id: 37, name: "Western" }
];

function App() {
    const [movies, setMovies] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [selected, setSelected] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [activeCategory, setActiveCategory] = useState('popular');
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const navRef = useRef(null);

    const fetchMovies = async (categoryId) => {
        try {
            if (isSearching) return;

            let response;
            if (categoryId === 'popular') {
                response = await ApiMovie.getPopularMovies();
            } else {
                response = await ApiMovie.getMoviesByGenre(categoryId);
            }
            setMovies(response.results);
            setActiveCategory(categoryId);
        } catch (error) {
            console.error("Error cargando", error);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (query.length > 2) {
            setIsSearching(true);
            try {
                const data = await ApiMovie.searchMulti(query);
                let results = [];

                data.results.forEach(item => {
                    if (item.media_type === 'movie') {
                        results.push(item);
                    }
                    else if (item.media_type === 'person' && item.known_for) {
                        const personMovies = item.known_for.filter(m => m.media_type === 'movie');
                        results.push(...personMovies);
                    }
                });

                const uniqueMovies = Array.from(new Set(results.map(a => a.id)))
                    .map(id => {
                        return results.find(a => a.id === id)
                    });

                if (uniqueMovies.length === 0) {
                    const popular = await ApiMovie.getPopularMovies();
                    setMovies(popular.results);
                } else {
                    setMovies(uniqueMovies);
                }

            } catch (error) {
                console.error("Error buscando", error);
            }
        } else if (query.length === 0) {
            setIsSearching(false);
            fetchMovies('popular');
        }
    };

    const openModalWithQr = async (movie) => {
        setSelected(movie);
        setIsOpenModal(true);
        setQrCode(null);
        setTrailerKey(null);

        //// GENERADOR DE QR ////
        const qr = await generateQr(`https://www.themoviedb.org/movie/${movie.id}`);
        setQrCode(qr);

        //// BUSCAR TRAILER ///
        try {
            const videoData = await ApiMovie.getMovieVideos(movie.id);
            const results = videoData.results || [];

            let officialTrailer = results.find(
                (vid) => vid.site === "YouTube" && vid.type === "Trailer" && vid.iso_639_1 === "es"
            );

            if (!officialTrailer) {
                officialTrailer = results.find(
                    (vid) => vid.site === "YouTube" && vid.type === "Trailer" && vid.iso_639_1 === "en"
                );
            }

            if (officialTrailer) {
                setTrailerKey(officialTrailer.key);
            } else if (results.length > 0) {
                setTrailerKey(results[0].key);
            }
        } catch (error) {
            console.error("Error buscando trailer:", error);
        }
    };

    const scrollNav = (direction) => {
        if (navRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchMovies('popular');
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">

                {/* ===== NAVBAR ===== */}
                <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 shadow-lg">
                    <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">

                        {/* Usuario */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-black" />
                            </div>
                            <span className="hidden md:block text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                                Nombre de Usuario
                            </span>
                        </div>

                        {/* Menu */}
                        <nav className="hidden lg:flex items-center gap-8 mr-4">
                            {[
                                { name: "INICIO", icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
                                { name: "PELÍCULAS", icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 19.814 6 20.25v1.125m-3.375 0h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125m17.25 0a1.125 1.125 0 00-1.125-1.125m-1.5 0v1.125c0 .436.504.75 1.125.75h1.5m-3 0h-9m0 0v-1.125c0-.436-.504-.75-1.125-.75h-1.5m11.25 0a1.125 1.125 0 00-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" },
                                { name: "SERIES", icon: "M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" },
                            ].map((item, i) => (
                                <a key={i} href="#" className="flex items-center gap-2 group cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors mb-0.5">
                                        <path d={item.icon} />
                                    </svg>
                                    <span className="text-[13px] font-bold tracking-widest text-neutral-400 group-hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                                        {item.name}
                                    </span>
                                </a>
                            ))}
                        </nav>

                        <div className={`relative flex items-center bg-gray-100 dark:bg-neutral-800 border border-transparent focus-within:border-white/50 focus-within:bg-neutral-900 transition-all duration-300 rounded-full overflow-hidden ${isSearching || searchTerm ? "w-64 bg-neutral-900 border-white/50" : "w-10 hover:bg-neutral-700"}`}>
                            <div className="pl-3 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-500 dark:text-gray-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Buscar..."
                                className={`bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ml-2 w-full h-full py-2 pr-4 transition-opacity duration-200 ${isSearching || searchTerm ? "opacity-100" : "opacity-0 focus:opacity-100"}`}
                            />
                        </div>

                    </div>
                </header>

                {/* ===== CONTENIDO ===== */}
                <main className="max-w-[1920px] mx-auto px-6 py-8">

                    {!isSearching && (
                        <>
                            {/* PILLS / CATEGORÍAS */}
                            <div className="flex justify-center mb-10 relative group/nav fade-in">
                                <button
                                    onClick={() => scrollNav('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-neutral-900/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/nav:opacity-100 transition-opacity hidden md:block backdrop-blur-sm border border-neutral-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <div
                                    ref={navRef}
                                    className="inline-flex items-center bg-gray-200 dark:bg-neutral-900/90 p-1.5 rounded-full border border-gray-300 dark:border-white/10 shadow-xl max-w-[90vw] md:max-w-[600px] overflow-x-auto scroll-smooth backdrop-blur-md"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => fetchMovies(category.id)}
                                            className={`w-32 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 text-center
                                                ${activeCategory === category.id
                                                ? "bg-white text-black shadow-lg scale-105"
                                                : "text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10"
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scrollNav('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-neutral-900/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover/nav:opacity-100 transition-opacity hidden md:block backdrop-blur-sm border border-neutral-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>

                        </>
                    )}

                    {/* ===== RESULTADOS / LISTA ===== */}
                    <section className="min-h-[50vh]">

                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            {isSearching
                                ? (movies.length > 0 && movies[0].id !== 999999
                                    ? `Resultados para: "${searchTerm}"`
                                    : <span className="text-gray-500 dark:text-gray-400 font-normal">No encontramos nada para "<span className="text-black dark:text-white font-bold">{searchTerm}</span>", prueba con esto:</span>)
                                : (
                                    <>
                                        <span className="w-1 h-6 bg-blue-600 rounded-full block shadow-sm"></span>
                                        {activeCategory === 'popular' ? "Tendencias Globales" : CATEGORIES.find(c => c.id === activeCategory)?.name}
                                    </>
                                )
                            }
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <div onClick={() => openModalWithQr(movie)} key={movie.id} className="cursor-pointer bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 group">
                                    <div className="relative overflow-hidden aspect-[2/3]">
                                        <img
                                            src={buildUrlImage(movie.poster_path)}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-4 relative">
                                        <p className="text-sm font-bold line-clamp-1 text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                                            {movie.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            <Modal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                qr={qrCode}
                movie={selected}
                trailerKey={trailerKey}
            />
        </>
    );
}

export default App;