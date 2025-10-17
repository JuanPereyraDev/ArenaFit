import './globals.css';

export const metadata = {
  title: 'ArenaFit - Administración',
  description: 'ArenaFit - Administración y validación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="relative min-h-screen w-full overflow-hidden text-white">
        {/* 🖼️ Fondo global tipo cover */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/fondo.png')" }}
        />

        {/* 🔲 Capa de oscurecimiento y blur para dar contraste */}
        <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm" />

        {/* Contenido dinámico */}
        <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
