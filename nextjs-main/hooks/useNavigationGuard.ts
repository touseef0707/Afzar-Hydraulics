"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import useFlowStore from '@/store/FlowStore';
import { useShallow } from 'zustand/shallow';

export function useNavigationGuard(flowId: string) {
  const router = useRouter();
  const { showToast } = useToast();
  const { isDirty, setDirty, saveFlow, clearRunResults, clearNodesAndEdges } = useFlowStore(
    useShallow((state) => ({
      isDirty: state.isDirty,
      setDirty: state.setDirty,
      saveFlow: state.saveFlow,
      clearRunResults: state.clearRunResults,
      clearNodesAndEdges: state.clearNodesAndEdges
    }))
  );

  const [showWarning, setShowWarning] = useState(false);
  const [navigationAction, setNavigationAction] = useState<(() => void) | null>(null);

  const handleNavigationAttempt = (action: () => void) => {
    if (isDirty) {
      setNavigationAction(() => action);
      setShowWarning(true);
    } else {
      action();
    }
  };

  const handleSaveAndLeave = async () => {
    await saveFlow(flowId, showToast);
    setDirty(false);
    setShowWarning(false);
    clearRunResults();
    clearNodesAndEdges();
    if (navigationAction) navigationAction();
  };

  const handleCancelAndLeave = () => {
    setShowWarning(false);
    setNavigationAction(null);
  };

  const handleForceLeave = async () => {
    setDirty(false);
    clearRunResults();
    clearNodesAndEdges();
    setShowWarning(false);

    // Wait for state updates to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Execute navigation
    router.push('/dashboard')
    setNavigationAction(null);
  };

  const handleBackNavigation = () => {
    handleNavigationAttempt(() => {
      clearNodesAndEdges();
      clearRunResults();
      router.push('/dashboard');
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handlePopState = () => {
      handleBackNavigation();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Add initial history state to prevent immediate back navigation
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty]);

  return {
    showWarning,
    handleSaveAndLeave,
    handleCancelAndLeave,
    handleForceLeave,
    handleNavigationAttempt,
    handleBackNavigation
  };
}