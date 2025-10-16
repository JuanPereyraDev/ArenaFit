"use client";
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useAdminListener from '@/components/useAdminListener';

export default function Home() {
  const [dni, setDni] = useState('');
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);

  const adminDocId = typeof window !== 'undefined' ? localStorage.getItem('adminDocId') : null;
  const adminPasswordHash = typeof window !== 'undefined' ? localStorage.getItem('adminPasswordHash') : null;

  useAdminListener(adminDocId, adminPasswordHash);

  const handleSubmit = async (e) => {
  e && e.preventDefault();
  if (!dni) return;
  setLoading(true);
  setCliente(null);

  try {
    const ref = doc(db, 'clientes', dni);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const hoy = new Date();

      const vencimiento = new Date(data.vencimiento);

      // ✅ Sumar 1 día y establecer la hora al final del día (23:59:59)
      vencimiento.setDate(vencimiento.getDate() + 1);
      vencimiento.setHours(23, 59, 59, 999);

      // ✅ Activo hasta el final del día siguiente del vencimiento
      const activo = hoy <= vencimiento;

      setCliente({ ...data, activo });
    } else {
      setCliente({ notFound: true });
    }
  } catch (err) {
    console.error(err);
    setCliente({ error: true });
  }

  // ✅ Limpia el campo después de presionar Enter
  setDni('');
  setLoading(false);
};





  return (
    <div className="min-h-screen flex items-center justify-center bg-gym relative" style={{ backgroundImage: "url('/fondo-gym.png')" }}>
      <div className="absolute inset-0 bg-black/75"></div>

      <main className="relative z-10 w-full max-w-md p-6">
        <header className="flex items-center justify-center gap-4 mb-4">
          <img src="/icon-bars.png" alt="icon" className="w-8 h-8" />
          <h1 className="text-4xl font-bold text-arena-yellow">ARENAFIT</h1>
          <img src="/icon-bars.png" alt="icon" className="w-8 h-8" />
        </header>

        <p className="text-center text-gray-300 mb-6">Verificación de Membresía</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate__animated animate__fadeInUp animate__faster">
          <input
            autoFocus
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresá tu DNI"
            className="px-4 py-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-arena-yellow animate__animated animate__fadeInLeft"
          />
        </form>

        <div className="flex justify-center mt-6">
          {loading && (
            <div className="w-12 h-12 border-4 border-t-arena-yellow border-gray-800 rounded-full animate-spin"></div>
          )}
        </div>

        {cliente && (
          <div className={"mt-6 p-5 rounded-xl bg-black/60 border border-gray-800 shadow-lg animate__animated " + (cliente.notFound ? 'animate__shakeX' : cliente.activo ? 'animate__bounceIn' : 'animate__shakeX')}>
            {cliente.notFound ? (
              <p className="text-red-400 font-semibold">❌ Cliente no registrado</p>
            ) : cliente.error ? (
              <p className="text-red-400 font-semibold">❌ Error al consultar</p>
            ) : (
              <div>
                <p className="text-2xl font-bold text-white">{cliente.nombre} {cliente.apellido}</p>
                <p className="text-gray-300 mt-2">DNI: {cliente.dni}</p>
                <p className="text-gray-300">Vence: {cliente.vencimiento}</p>
                <p className={`mt-4 text-xl font-bold ${cliente.activo ? 'text-arena-green animate__bounceIn' : 'text-arena-red animate__shakeX'}`}>
                  {cliente.activo ? '✅ Mensualidad al día' : '❌ Mensualidad vencida'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
