"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const msg = localStorage.getItem('logoutMessage');
    if (msg) {
      setMessage(msg);
      localStorage.removeItem('logoutMessage');
      setTimeout(() => setMessage(''), 5000);
    }
  }, []);

  const handleLogin = async (e) => {
  e && e.preventDefault();
  setMessage('');
  if (!email || !password) return;
  setLoading(true);

  try {
    const q = query(collection(db, 'admins'), where('email', '==', email));
    const snap = await getDocs(q);

    if (snap.empty) {
      setMessage('❌ Credenciales incorrectas');
      setLoading(false);
      return;
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data();

    if (!data.activo) {
      setMessage('⚠️ Tu cuenta está suspendida administrativamente');
      setLoading(false);
      return;
    }

    if (data.passwordHash !== password) {
      setMessage('❌ Credenciales incorrectas');
      setLoading(false);
      return;
    }

    // 🔐 Guardar sesión local
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminDocId', docSnap.id);
    localStorage.setItem('adminPasswordHash', data.passwordHash);

    document.cookie = 'adminLogged=true; path=/;';

    // ✅ Mostrar mensaje y redirigir al validador
    setMessage('✅ Sesión iniciada correctamente');
    setTimeout(() => router.push('/'), 700);

  } catch (err) {
    console.error(err);
    setMessage('❌ Ocurrió un error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gym relative" style={{ backgroundImage: "url('/fondo-gym.png')" }}>
      <div className="absolute inset-0 bg-black/75"></div>
      <main className="relative z-10 w-full max-w-md p-6">
        <header className="flex items-center justify-center gap-4 mb-2">
          <img src="/icon-bars.png" alt="icon" className="w-8 h-8" />
          <h1 className="text-4xl font-bold text-arena-yellow">ARENAFIT</h1>
          <img src="/icon-bars.png" alt="icon" className="w-8 h-8" />
        </header>

        <p className="text-center text-gray-300 mb-4">Administración ArenaFit</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 animate__animated animate__fadeInUp animate__faster">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-arena-yellow animate__animated animate__fadeInLeft"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-arena-yellow animate__animated animate__fadeInRight"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            required
          />
        </form>

        <div className="flex justify-center mt-6">
          {loading && <div className="w-12 h-12 border-4 border-t-arena-yellow border-gray-800 rounded-full animate-spin"></div>}
        </div>

        {message && (
          <div className={`mt-4 text-center animate__animated ${message.includes('✅') ? 'text-arena-green animate__bounceIn' : message.includes('❌') ? 'text-arena-red animate__shakeX' : 'text-arena-yellow animate__flash'}`}>
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
