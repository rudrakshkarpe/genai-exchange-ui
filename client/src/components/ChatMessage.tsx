import { type ChatMessage } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${message.type}-${message.id}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-card-border text-card-foreground"
        )}
      >        <div className="text-sm leading-relaxed">
          <ReactMarkdown components={{
            strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            // Add more component overrides for markdown elements as needed
            em: ({ node, ...props }) => <span className="italic" {...props} />,
            // Replace standard markdown newlines with proper breaks
            br: () => <br className="my-1" />
          }}>
            {/* Convert standard newlines to markdown breaks before rendering */}
            {message.content.replace(/\n/g, '  \n')}
          </ReactMarkdown>
        </div>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}