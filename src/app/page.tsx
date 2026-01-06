"use client";

import React, { useState, useEffect } from 'react';
import ThreePaneLayout from "@/components/layout/ThreePaneLayout";
import LeftPane from "@/components/layout/LeftPane";
import MainCanvas from "@/components/layout/MainCanvas";
import RightPane from "@/components/layout/RightPane";
import LandingPage from "@/components/landing/LandingPage";
import { useSimulation } from "@/hooks/useSimulation";
import { useVIPVisits } from "@/hooks/useVIPVisits";
import { ParsedVIPVisit } from "@/types/vip";
import { UploadedFile } from "@/types/fileUpload";
import { ModuleName } from "@/services/moduleDetector";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isRightMaximized, setIsRightMaximized] = useState(false);
  const [activeModule, setActiveModule] = useState(''); // No default active module
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Check localStorage on mount to see if user has already seen landing page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenLanding = localStorage.getItem('hasSeenLanding');
      if (hasSeenLanding === 'true') {
        setShowLanding(false);
      }
    }
  }, []);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenLanding', 'true');
    }
    setShowLanding(false);
  };

  const { vipVisits, addVIPVisit } = useVIPVisits();

  const handleVIPVisitParsed = (parsedVisit: ParsedVIPVisit) => {
    // Convert parsed visit to VIPVisit format and store
    addVIPVisit({
      visitor: parsedVisit.visitor,
      title: parsedVisit.title,
      date: parsedVisit.date.toISOString().split('T')[0],
      time: parsedVisit.time,
      location: parsedVisit.location,
      protocolLevel: parsedVisit.protocolLevel,
      assignedEscort: parsedVisit.protocolLevel === 'maximum' ? 'Executive Officer' : undefined,
    });
  };

  const handleModuleDetected = (module: ModuleName) => {
    if (module) {
      setActiveModule(module);
    }
  };

  const { status, messages, sections, startSimulation, clearPlanner, reset } = useSimulation({
    onVIPVisitParsed: handleVIPVisitParsed,
    onModuleDetected: handleModuleDetected
  });

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFile(file);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasSeenLanding');
    }
    setShowLanding(true);
    setActiveModule('');
    reset();
  };

  const handleBackToLanding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenLanding', 'false');
    }
    setShowLanding(true);
    setActiveModule('');
    reset();
  };

  // Show landing page if not dismissed
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <ThreePaneLayout
      isLeftCollapsed={isLeftCollapsed}
      isRightCollapsed={isRightCollapsed}
      isRightMaximized={isRightMaximized}
      onRightPaneToggle={() => setIsRightCollapsed(false)}
      left={
        <LeftPane
          isCollapsed={isLeftCollapsed}
          onToggle={() => setIsLeftCollapsed(!isLeftCollapsed)}
          onNewChat={reset}
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          onLogout={handleLogout}
          onBackToLanding={handleBackToLanding}
        />
      }
      right={
        <RightPane
          messages={messages}
          status={status}
          sections={sections}
          onSendMessage={startSimulation}
          onClearPlanner={clearPlanner}
          onFileUploaded={handleFileUploaded}
          isCollapsed={isRightCollapsed}
          isMaximized={isRightMaximized}
          onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
          onToggleMaximize={() => setIsRightMaximized(!isRightMaximized)}
        />
      }
    >
      <MainCanvas status={status} sections={sections} activeModule={activeModule} vipVisits={vipVisits} uploadedFile={uploadedFile} />
    </ThreePaneLayout>
  );
}
