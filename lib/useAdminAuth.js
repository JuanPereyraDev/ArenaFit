'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const adminDocId = localStorage.getItem('adminDocId');
    const savedHash = localStorage.getItem('adminPasswordHash');

    if (!adminDocId || !savedHash) {
      // No hay sesión activa → redirigir al login
      router.push('/login');
      return;
    }

    // 🔥 Escucha en tiempo real los cambios del documento del admin
    const ref = doc(db, 'admins', adminDocId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        logout('❌ Usuario eliminado del sistema');
        return;
      }

      const data = snap.data();
      const stillValid = data.activo && data.passwordHash === savedHash;

      if (!stillValid) {
        logout('⚠️ Tu sesión fue cerrada por un cambio administrativo');
      }
    });

    const logout = (msg) => {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminDocId');
      localStorage.removeItem('adminPasswordHash');
      document.cookie = 'adminLogged=false; path=/;';
      localStorage.setItem('logoutMessage', msg);
      router.push('/login');
    };

    return () => unsub();
  }, [router]);
}
