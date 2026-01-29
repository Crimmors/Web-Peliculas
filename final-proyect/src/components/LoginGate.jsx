import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginGate() {
    const { signInWithGoogle, signInWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // null, 'success', 'error'

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        const { error } = await signInWithEmail(email);

        if (error) {
            setMessage({ type: 'error', text: 'Error al enviar el correo. Intenta de nuevo.' });
        } else {
            setMessage({ type: 'success', text: '¡Enlace enviado! Revisa tu correo para entrar.' });
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center bg-[#0f0f0f] text-white rounded-xl p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-sm text-center">
                {/* icono */}
                <div className="mb-6 bg-blue-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold mb-2">Ingresa o Regístrate</h3>
                <p className="text-gray-400 mb-8 text-sm">
                    Necesitas una cuenta para ver este contenido. Si es tu primera vez, crearemos una automáticamente.
                </p>

                {/* boton de google*/}
                <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 py-3 rounded-xl font-bold transition-all shadow-lg text-sm mb-6 transform hover:scale-[1.02]"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                    Continuar con Google
                </button>

                {/* Divisor */}
                <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-700"></div>
                    <span className="px-3 text-xs text-gray-500 uppercase tracking-wider">O usa tu correo</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                </div>

                {/* Forms para email */}
                {message && message.type === 'success' ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center animate-fadeIn">
                        <p className="text-green-400 font-bold text-sm mb-1">✅ ¡Correo Enviado!</p>
                        <p className="text-gray-400 text-xs">Revisa tu bandeja de entrada (y spam) y haz clic en el enlace mágico para entrar.</p>
                        <button onClick={() => setMessage(null)} className="mt-3 text-xs text-green-400 underline">Intentar con otro correo</button>
                    </div>
                ) : (
                    <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-xl p-3.5 focus:outline-none focus:border-blue-500 placeholder-gray-500 transition-colors"
                            required
                        />
                        <button
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
                        </button>
                        {message && message.type === 'error' && <p className="text-red-400 text-xs text-center">{message.text}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}