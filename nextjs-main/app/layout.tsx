import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { ProjectProvider } from '@/context/ProjectContext';

export const metadata: Metadata = {
  title: 'Afzar Hydraulics',
  description: 'Hydraulic simulation and design platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProjectProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <ToastProvider>
                  {children}
                </ToastProvider>
              </main>
              <Footer companyName="Afzar Hydraulics" />
            </div>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
