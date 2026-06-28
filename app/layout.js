import "./globals.css";

export const metadata = {
  title: "ShopBuilder - Admin Dashboard",
  description: "Instantly create and host low-cost, premium websites for small businesses and local shops.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
