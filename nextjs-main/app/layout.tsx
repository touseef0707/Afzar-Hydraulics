import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProjectProvider } from '@/context/ProjectContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
              <main className="flex-grow">{children}</main>
              <Footer companyName="Afzar Hydraulics" />
            </div>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
