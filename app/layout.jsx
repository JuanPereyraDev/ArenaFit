import './globals.css';

export const metadata = {
  title: "ArenaFit - Administración",
  description: "ArenaFit - Administración y validación",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
