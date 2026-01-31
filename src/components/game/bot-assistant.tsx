"use client";

import { useEffect, useRef } from "react";

interface BotAssistantProps {
  messages: string[];
}

export default function BotAssistant({ messages }: BotAssistantProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-primary/50">
        <h3 className="font-bold font-headline">// BOT ASSISTANT // LOGS</h3>
      </div>
      <div ref={scrollRef} className="flex-grow p-4 font-mono text-sm overflow-y-auto">
        {messages.map((message, index) => (
          <p key={index} className="mb-1">
            <span className="text-primary/80">[BOT] : </span>
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
