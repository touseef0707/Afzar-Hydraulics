// app/dashboard/canvas/[id]/page.tsx
import { FlowProvider } from '@/context/FlowContext';
import CanvasSidebar from '@/app/dashboard/_components/CanvasSidebar';
import Canvas from '@/app/dashboard/_components/Canvas';

interface PageProps {
  params: {
    id: string;
  };
}

interface CanvasPageProps {
  params: {
    id: string;
  };
}


export default async function CanvasPage({ params }: PageProps) {
  const param = await params;
  const id = param.id;
  return (
    <div className="flex flex-col h-screen">
      <FlowProvider flowId={id}>
        <div className="flex flex-1 w-full max-w-7xl mx-auto gap-4">
          <CanvasSidebar />
          <Canvas />
        </div>
      </FlowProvider>
    </div>
  );
};
