// app/dashboard/_components/canvas/NavigationGuard.tsx
"use client";

import { useParams } from 'next/navigation';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import SaveWarningModal from './SaveWarningModal';

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const flowId = params?.id as string;
  
  const {
    showWarning,
    handleSaveAndLeave,
    handleCancelAndLeave
  } = useNavigationGuard(flowId);

  return (
    <>
      {children}
      {showWarning && (
        <SaveWarningModal
          onSave={handleSaveAndLeave}
          onCancel={handleCancelAndLeave}
        />
      )}
    </>
  );
}