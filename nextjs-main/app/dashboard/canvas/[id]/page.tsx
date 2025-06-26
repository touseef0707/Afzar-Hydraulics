import CanvasSidebar from '@/app/dashboard/_components/CanvasSidebar';
import Canvas from '@/app/dashboard/_components/Canvas';

export default async function CanvasPage() {
  return (
    <div className="flex flex-col h-screen p-2">
        <div className="flex flex-1 w-full max-w-7xl mx-auto gap-4">
          <CanvasSidebar />
          <Canvas />
        </div>
    </div>
  );
};
