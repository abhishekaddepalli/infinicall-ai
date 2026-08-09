"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";

const InboxLayout = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100dvh-96px)] overflow-hidden gap-4 relative">
      <div className={cn(
        "w-[320px] max-w-[90vw] min-[1200px]:w-[380px] min-[1200px]:max-w-none flex-shrink-0 bg-bg-card border border-input-border-color flex flex-col z-40 rounded-lg overflow-hidden transition-all duration-300 shadow-2xl min-[1200px]:shadow-none h-full",
        "absolute min-[1200px]:relative",
        isSidebarOpen
          ? "left-0 rtl:left-auto rtl:right-0"
          : "-left-[400px] rtl:left-auto rtl:-right-[400px] min-[1200px]:left-0 min-[1200px]:rtl:left-auto min-[1200px]:rtl:right-0"
      )}>
        <ConversationList
          selectedSessionId={selectedSessionId}
          onSelectSession={(id) => {
            setSelectedSessionId(id);
            // Optionally close sidebar on mobile when a chat is selected
            if (window.innerWidth < 1200) {
              setIsSidebarOpen(false);
            }
          }}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className="flex-1 flex flex-col bg-bg-card border border-input-border-color relative overflow-hidden rounded-lg w-full">
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/0 z-30 min-[1200px]:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <ConversationView
          sessionId={selectedSessionId}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
};

export default InboxLayout;
