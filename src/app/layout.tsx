import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Amr Samir Edris | Senior Account Manager & Mega Events Specialist',
  description:
    'Executive portfolio of Amr Samir Edris. Senior Account Manager specializing in Mega Events, Large-Scale Productions, and Brand Strategy across the UAE and Middle East.',
  keywords: [
    'Amr Samir Edris',
    'Amr Samir',
    'Mega Events',
    'Account Manager',
    'Project Manager',
    'Production Specialist',
    'Dubai Events',
    'Abu Dhabi Events',
  ],
  authors: [{ name: 'Amr Samir Edris' }],
  openGraph: {
    title: 'Amr Samir Edris | Portfolio',
    description: 'Senior Account Manager | Mega Events & Large-Scale Productions',
    url: 'https://amrsamir.me',
    siteName: 'Amr Samir Edris Portfolio',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" className="h-full">
      <body className="antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-blue-500/30 selection:text-white">
        <ThemeProvider>
          {clarityId && (
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `}
            </Script>
          )}
          <Navigation />
          <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
            {children}
          </main>
          <footer className="w-full text-center py-8 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto bg-[var(--bg-secondary)]/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Amr Samir Edris. All rights reserved.</p>
              <div className="flex items-center gap-6 text-[11px]">
                <a
                  href="mailto:amrsamiredris@gmail.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  amrsamiredris@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/amrsamiredris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
