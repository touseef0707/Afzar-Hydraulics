// file: app/dashboard/canvas/[id]/page.tsx

// This remains a Server Component
import FlowCanvas from '@/app/dashboard/_components/FlowCanvas';
// --- 1. IMPORT THE NEW SIDEBAR COMPONENT ---
import CanvasSidebar from '@/app/dashboard/_components/CanvasSidebar';

export default async function CanvasPage({ params }: { params: { id: string } }) {
  const { id: flowId } = await params;

  return (
    <main className="flex flex-row h-screen bg-gray-100">
      
      {/* The sidebar is the first item in the flex container */}
      <CanvasSidebar />

      {/* 
        This div will hold the canvas and grow to fill the remaining space.
        `flex-1` is shorthand for `flex-grow: 1`.
        `p-4` adds some padding around the canvas area.
      */}
      <div className="flex-1 p-4">
        {/* The FlowCanvas component (which contains the Provider and Canvas) goes here */}
        <FlowCanvas flowId={flowId} />
      </div>

    </main>
  );
}
