"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { NODE_CONFIG, COLOR_CLASSES } from './flow_config';
import useFlowStore from '@/store/FlowStore';
import SaveWarningModal from './SaveWarningModal';
import { useToast } from '@/components/Toast';

export default function CanvasSidebar() {
  const router = useRouter();
  const params = useParams();
  const flowId = params?.id as string;
  const isDirty = useFlowStore((state) => state.isDirty);
  const saveFlow = useFlowStore((state) => state.saveFlow);
  const setDirty = useFlowStore((state) => state.setDirty);
  const [showWarning, setShowWarning] = useState(false);
  const { showToast } = useToast();

  const handleBack = () => {
    if (isDirty) {
      setShowWarning(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSaveAndLeave = () => {
    saveFlow(flowId, showToast);
    setDirty(false);
    setShowWarning(false);
    router.push('/dashboard');
  };
  const handleCancelAndLeave = () => {
    setShowWarning(false);
    router.push('/dashboard');
  };

  return (
    <>
      <aside className="w-64 h-full bg-white border-r border-gray-200 p-4 flex flex-col shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Components</h2>
          <div className="w-8" />
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {Object.entries(NODE_CONFIG).map(([nodeType, nodeInfo]) => {
            const IconComponent = nodeInfo.icon;
            return (
              <div
                key={nodeType}
                onDragStart={(e) => {
                  const nodeInfoObj = { type: nodeType, label: nodeInfo.label };
                  e.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfoObj));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                draggable
                className={`group flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 cursor-grab transition-all duration-200 hover:shadow-md ${COLOR_CLASSES.bgHover[nodeInfo.color]} ${COLOR_CLASSES.borderHover[nodeInfo.color]}`}
              >
                <div className="flex items-center gap-3">
                  <span className={COLOR_CLASSES.text[nodeInfo.color]}>
                    <IconComponent size={20} />
                  </span>
                  <span className="font-medium text-gray-700">{nodeInfo.label}</span>
                </div>
                <GripVertical
                  className={`text-gray-300 transition-colors ${COLOR_CLASSES.gripHover[nodeInfo.color]}`}
                />
              </div>
            );
          })}
        </div>
      </aside>
      {showWarning && (
        <SaveWarningModal
          onSave={handleSaveAndLeave}
          onCancel={handleCancelAndLeave}
        />
      )}
    </>
  );
}
