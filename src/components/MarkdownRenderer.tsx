import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="markdown-content text-sm leading-relaxed text-gray-800 dark:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          p: Paragraph,
          ul: UnorderedList,
          ol: OrderedList,
          li: ListItem,
          h1: Heading1,
          h2: Heading2,
          h3: Heading3,
          h4: Heading4,
          blockquote: Blockquote,
          table: Table,
          thead: TableHead,
          tr: TableRow,
          th: TableHeader,
          td: TableCell,
          a: Link,
          strong: Strong,
          em: Emphasis,
          hr: Divider,
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  node?: unknown;
}

function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const text = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  const match = /language-(\w+)/.exec(className || '');
  const isInline = inline || !match;

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono text-pink-600 dark:text-pink-400">
        {children}
      </code>
    );
  }

  const language = match[1];
  const codeContent = String(children).replace(/\n$/, '');

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-xs text-gray-400 font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus as never}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: '1rem',
          fontSize: '0.8rem',
          lineHeight: '1.5',
        }}
        {...(props as Record<string, unknown>)}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
}

interface MarkdownComponentProps {
  children: React.ReactNode;
}

function Paragraph({ children }: MarkdownComponentProps) {
  return <p className="my-2">{children}</p>;
}

function UnorderedList({ children }: MarkdownComponentProps) {
  return <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>;
}

function OrderedList({ children }: MarkdownComponentProps) {
  return <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>;
}

function ListItem({ children }: MarkdownComponentProps) {
  return <li className="text-sm">{children}</li>;
}

function Heading1({ children }: MarkdownComponentProps) {
  return <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>;
}

function Heading2({ children }: MarkdownComponentProps) {
  return <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>;
}

function Heading3({ children }: MarkdownComponentProps) {
  return <h3 className="text-sm font-bold mt-3 mb-1.5">{children}</h3>;
}

function Heading4({ children }: MarkdownComponentProps) {
  return <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>;
}

function Blockquote({ children }: MarkdownComponentProps) {
  return (
    <blockquote className="my-2 pl-4 border-l-4 border-blue-300 dark:border-blue-500/40 bg-blue-50/50 dark:bg-blue-500/10 py-2 pr-2 rounded-r text-gray-600 dark:text-gray-300 italic">
      {children}
    </blockquote>
  );
}

function Table({ children }: MarkdownComponentProps) {
  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

function TableHead({ children }: MarkdownComponentProps) {
  return <thead className="bg-gray-100 dark:bg-gray-700/50">{children}</thead>;
}

function TableRow({ children }: MarkdownComponentProps) {
  return <tr className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">{children}</tr>;
}

function TableHeader({ children }: MarkdownComponentProps) {
  return <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{children}</th>;
}

function TableCell({ children }: MarkdownComponentProps) {
  return <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{children}</td>;
}

interface LinkProps {
  children: React.ReactNode;
  href?: string;
}

function Link({ children, href }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline hover:no-underline"
    >
      {children}
    </a>
  );
}

function Strong({ children }: MarkdownComponentProps) {
  return <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>;
}

function Emphasis({ children }: MarkdownComponentProps) {
  return <em>{children}</em>;
}

function Divider(): JSX.Element {
  return <hr className="my-4 border-gray-200 dark:border-gray-700" />;
}
