import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BearAtlas - Bear Travel Index',
  description: 'Discover worldwide bear events, weeks, runs, cruises, resorts, and parties with advanced filtering and multiple views.',
  keywords: 'bear events, bear week, bear run, bear cruise, bear resort, bear party, travel, lgbtq',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  🐻 BearAtlas
                </h1>
              </div>
              <nav className="flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
                <a href="/map" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Map
                </a>
                <a href="/list" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  List
                </a>
                <a href="/calendar" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Calendar
                </a>
                <a href="/wizard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Trip Wizard
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}