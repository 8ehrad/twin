'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  Check,
  Clipboard,
  RefreshCcw,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const starterPrompts = [
  'Tell me a bit about his data science skills',
  'What AI projects has Behrad built?',
  'What roles is he looking for?',
  'How does he work in a team?',
];

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  h1: ({ children }) => (
    <h1 className="mb-3 mt-1 text-base font-semibold leading-6 text-slate-950">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-[15px] font-semibold leading-6 text-slate-950 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-semibold leading-6 text-slate-950 first:mt-0">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 ml-4 list-disc space-y-1.5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-4 list-decimal space-y-1.5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-950">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-4 transition-colors hover:text-teal-900"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className);

    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-md bg-slate-950 px-3 py-2 font-mono text-xs leading-5 text-slate-100">
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-900">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-3 overflow-x-auto last:mb-0">{children}</pre>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-teal-600/40 pl-3 text-slate-700 last:mb-0">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-md border border-slate-200 last:mb-0">
      <table className="w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-950">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-slate-100 px-3 py-2 align-top last:border-b-0">
      {children}
    </td>
  ),
};

export default function Twin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [hasAvatar, setHasAvatar] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    if (messages.length === 0 && !isLoading) return;
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    fetch('/avatar.jpg', { method: 'HEAD' })
      .then((res) => setHasAvatar(res.ok))
      .catch(() => setHasAvatar(false));
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = '0px';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
  }, [input]);

  const sendMessage = async (messageOverride?: string) => {
    const content = (messageOverride ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            session_id: sessionId || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send message');
      }

      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.setTimeout(() => setCopiedMessageId(null), 1600);
    } catch {
      setCopiedMessageId(null);
    }
  };

  const retryLastUserMessage = () => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setSessionId('');
    setInput('');
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="flex h-full min-h-[680px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {hasAvatar ? (
              <Image
                src="/avatar.jpg"
                alt="Behrad Zabihi"
                width={44}
                height={44}
                priority
                className="h-11 w-11 rounded-full border border-slate-200 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-950 sm:text-lg">
                Behrad&apos;s Digital Twin
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>Data Science</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>AI Engineering</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Manchester, UK</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={retryLastUserMessage}
              disabled={messages.length === 0 || isLoading}
              aria-label="Retry last question"
              title="Retry last question"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearConversation}
              disabled={messages.length === 0 || isLoading}
              aria-label="Clear conversation"
              title="Clear conversation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-5 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-5"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-2xl flex-col items-center px-2 py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-teal-800">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="max-w-md text-base font-medium leading-7 text-slate-950">
              Start with a question about Behrad&apos;s work, projects, or career fit.
            </p>
            <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
              {starterPrompts.map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => sendMessage(promptText)}
                  disabled={isLoading}
                  className="rounded-md border border-slate-200 bg-white px-3 py-3 text-left text-sm leading-5 text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="mt-1 flex-shrink-0">
                {hasAvatar ? (
                  <Image
                    src="/avatar.jpg"
                    alt="Behrad Zabihi"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )}

            <div
              className={`group max-w-[86%] rounded-lg px-3.5 py-3 text-sm leading-6 shadow-sm sm:max-w-[74%] ${
                message.role === 'user'
                  ? 'bg-teal-700 text-white'
                  : message.isError
                    ? 'border border-red-200 bg-red-50 text-red-900'
                    : 'border border-slate-200 bg-white text-slate-800'
              }`}
            >
              {message.role === 'assistant' && !message.isError ? (
                <div className="markdown-answer">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={markdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}

              <div
                className={`mt-2 flex items-center justify-between gap-3 text-xs ${
                  message.role === 'user'
                    ? 'text-teal-100'
                    : message.isError
                      ? 'text-red-700'
                      : 'text-slate-500'
                }`}
              >
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {message.role === 'assistant' && !message.isError && (
                  <button
                    type="button"
                    onClick={() => copyMessage(message)}
                    aria-label="Copy answer"
                    title="Copy answer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 opacity-100 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Clipboard className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="mt-1 flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="mt-1 flex-shrink-0">
              {hasAvatar ? (
                <Image
                  src="/avatar.jpg"
                  alt="Behrad Zabihi"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-slate-300 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2" aria-label="Behrad's twin is replying">
                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-700" />
                <div className="delay-100 h-2 w-2 animate-bounce rounded-full bg-teal-700" />
                <div className="delay-200 h-2 w-2 animate-bounce rounded-full bg-teal-700" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Behrad's twin a question..."
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="mb-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
