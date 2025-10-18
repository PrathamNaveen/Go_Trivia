import "./globals.css";

export const metadata = {
  title: "Trivia Game",
  description: "Fun trivia frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
