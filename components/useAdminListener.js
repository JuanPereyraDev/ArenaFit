import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function useAdminListener(adminDocId, currentPasswordHash) {
  const router = useRouter();

  useEffect(() => {
    if (!adminDocId) return;

    const ref = doc(db, 'admins', adminDocId);

    const unsub = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        localStorage.removeItem('adminEmail');
        localStorage.setItem('logoutMessage', '⚠️ Tu cuenta fue cerrada por cambios administrativos');
        router.push('/login');
        return;
      }

      const data = snapshot.data();
      if (data.activo === false || data.passwordHash !== currentPasswordHash) {
        localStorage.removeItem('adminEmail');
        localStorage.setItem('logoutMessage', '⚠️ Tu cuenta fue cerrada por cambios administrativos');
        router.push('/login');
      }
    });

    return () => unsub();
  }, [adminDocId, currentPasswordHash, router]);
}
