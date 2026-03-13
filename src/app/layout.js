import "./globals.css";

export const metadata = {
  title: "Contact Manager",
  description: "Manage your contacts efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
