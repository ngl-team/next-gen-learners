import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata: Metadata = {
  title: 'AI at a $3B Community Bank: Research Brief for Union Savings Bank',
  description: 'A research paper prepared for the Union Savings Bank board, May 2026.',
  robots: { index: false, follow: false },
};

export default async function UsbPaperPage() {
  const filePath = path.join(process.cwd(), 'src/app/usb/paper.md');
  const markdown = await fs.readFile(filePath, 'utf8');

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <article className="paper">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      </div>
      <style>{`
        .paper {
          font-family: 'Georgia', 'Iowan Old Style', 'Times New Roman', serif;
          font-size: 17px;
          line-height: 1.7;
          color: #1A1A1A;
        }
        .paper h1 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 2.1rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 0;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .paper h2 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.55rem;
          font-weight: 700;
          line-height: 1.25;
          margin-top: 3rem;
          margin-bottom: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #E5E5E0;
          letter-spacing: -0.015em;
        }
        .paper h3 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 2.25rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        .paper h4 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .paper p {
          margin: 0 0 1.1rem 0;
        }
        .paper ul, .paper ol {
          margin: 0 0 1.1rem 0;
          padding-left: 1.5rem;
        }
        .paper li {
          margin-bottom: 0.45rem;
        }
        .paper strong {
          font-weight: 700;
        }
        .paper a {
          color: #1F4DBF;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          word-break: break-word;
        }
        .paper a:hover {
          color: #143A91;
        }
        .paper hr {
          border: 0;
          border-top: 1px solid #E5E5E0;
          margin: 2.5rem 0;
        }
        .paper blockquote {
          border-left: 3px solid #C9C9C0;
          padding-left: 1rem;
          margin: 1.25rem 0;
          color: #555;
          font-style: italic;
        }
        .paper code {
          font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
          font-size: 0.92em;
          background: #F0F0EA;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }
        .paper sup a {
          color: #1F4DBF;
          font-size: 0.75em;
          text-decoration: none;
          padding: 0 2px;
        }
        .paper .footnotes {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #E5E5E0;
          font-size: 0.88rem;
          color: #444;
        }
        .paper .footnotes ol {
          padding-left: 1.25rem;
        }
        .paper .footnotes li {
          margin-bottom: 0.6rem;
        }
        .paper .footnotes a {
          word-break: break-all;
        }
        .paper em {
          font-style: italic;
        }
        @media (max-width: 640px) {
          .paper {
            font-size: 16px;
          }
          .paper h1 { font-size: 1.7rem; }
          .paper h2 { font-size: 1.35rem; }
          .paper h3 { font-size: 1.1rem; }
        }
      `}</style>
    </main>
  );
}
