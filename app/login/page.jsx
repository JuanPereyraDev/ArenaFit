'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const msg = localStorage.getItem('logoutMessage')
    if (msg) {
      setMessage(msg)
      localStorage.removeItem('logoutMessage')
      setTimeout(() => setMessage(''), 5000)
    }
  }, [])

  const handleLogin = async (e) => {
    e && e.preventDefault()
    setMessage('')
    if (!email || !password) return
    setLoading(true)

    try {
      const q = query(collection(db, 'admins'), where('email', '==', email))
      const snap = await getDocs(q)

      if (snap.empty) {
        setMessage('❌ Credenciales incorrectas')
        setLoading(false)
        return
      }

      const docSnap = snap.docs[0]
      const data = docSnap.data()

      if (!data.activo) {
        setMessage('⚠️ Tu cuenta está suspendida administrativamente')
        setLoading(false)
        return
      }

      if (data.passwordHash !== password) {
        setMessage('❌ Credenciales incorrectas')
        setLoading(false)
        return
      }

      localStorage.setItem('adminEmail', email)
      localStorage.setItem('adminDocId', docSnap.id)
      localStorage.setItem('adminPasswordHash', data.passwordHash)
      document.cookie = 'adminLogged=true; path=/;'

      setMessage('✅ Sesión iniciada correctamente')
      setTimeout(() => router.push('/'), 700)
    } catch (err) {
      console.error(err)
      setMessage('❌ Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 🖼️ Fondo global */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo.png')" }}
      />

      {/* Overlay oscuro con blur */}
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm" />

      {/* Botón principal animado */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setShowModal(true)}
          className="px-10 py-3 bg-yellow-400 text-black font-extrabold text-lg rounded-lg hover:bg-yellow-300 transition-all shadow-lg"
        >
          INICIAR SESIÓN
        </button>
      </motion.div>

      {/* Modal animado */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Fondo difuminado */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            {/* Contenedor del modal */}
            <motion.div
              className="fixed z-50 bg-black/80 border border-yellow-500 rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-white flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
            >
              <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
                Iniciar Sesión
              </h2>

              <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-black/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-black/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all"
                >
                  {loading ? 'Cargando...' : 'Ingresar'}
                </button>
              </form>

              {message && (
                <div
                  className={`mt-4 text-center text-sm ${
                    message.includes('✅')
                      ? 'text-green-400'
                      : message.includes('❌')
                      ? 'text-red-400'
                      : 'text-yellow-300'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-yellow-400 text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
