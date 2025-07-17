// Importing the main canvas component where drawing or flow happens
import Canvas from '@/app/dashboard/_components/canvas/Canvas';

// Importing the sidebar component for canvas tools, controls, or navigation
import CanvasSidebar from '@/app/dashboard/_components/canvas/CanvasSidebar';

interface Props {
  params: {
    id: string;
  };
}


// Async server component to render a specific canvas page based on dynamic route parameter (id)
export default async function CanvasPage({ params }: Props) {
  // Destructuring the flow ID from route params
  const { id } = params;

  return (
    // Main layout wrapper: horizontal flex layout, full viewport height, gray background
    <main className="flex flex-row h-screen bg-gray-100">
      
      {/* Sidebar area on the left */}
      <CanvasSidebar />

      {/* Main canvas area on the right */}
      <div className="flex-1 p-4">
        {/* Rendering the Canvas component and passing the flowId as a prop */}
        <Canvas flowId={id} />
      </div>

    </main>
  );
}
