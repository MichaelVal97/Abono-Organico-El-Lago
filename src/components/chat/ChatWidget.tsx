'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !wsRef.current) {
            connectWebSocket();
        }
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const connectWebSocket = () => {
        try {
            const ws = new WebSocket('ws://localhost:8000/ws/chat');

            ws.onopen = () => {
                setIsConnected(true);
                console.log('Connected to chat server');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'bot') {
                    setIsTyping(false);
                    addMessage(data.text, 'bot');
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                console.log('Disconnected from chat server');
                // Reconnect after 3 seconds
                setTimeout(() => {
                    if (isOpen) connectWebSocket();
                }, 3000);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    };

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        setMessages((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).substring(7),
                text,
                sender,
                timestamp: new Date(),
            },
        ]);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || !wsRef.current || !isConnected) return;

        const message = inputValue.trim();
        addMessage(message, 'user');
        setInputValue('');
        setIsTyping(true);

        wsRef.current.send(JSON.stringify({ text: message }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-background border border-border rounded-lg shadow-xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <h3 className="font-bold">Soporte El Lago</h3>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] p-3 rounded-lg text-sm",
                                            msg.sender === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-muted p-3 rounded-lg rounded-tl-none flex gap-1">
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-background rounded-b-lg">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Escribe tu mensaje..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1"
                            />
                            <Button size="icon" onClick={handleSendMessage} disabled={!isConnected}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        {!isConnected && (
                            <p className="text-xs text-destructive mt-2 text-center">
                                Desconectado del servidor
                            </p>
                        )}
                    </div>
                </div>
            )}

            <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
}
