import Canvas from '@/app/dashboard/_components/canvas/Canvas';
import CanvasSidebar from '@/app/dashboard/_components/canvas/CanvasSidebar';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CanvasPage({ params }: PageProps) {
  const { id: flowId } = await params;

  return (
    <main className="flex flex-row h-screen bg-gray-100">
      <CanvasSidebar />
      <div className="flex-1 p-4">
        <Canvas flowId={flowId} />
      </div>
    </main>
  );
}