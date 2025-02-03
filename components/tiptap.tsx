'use client'

import { Button } from '@/components/ui/button';
import { useCurrentEditor, EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MathExtension from '@aarkue/tiptap-math-extension'
import KaTeX from './katex';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import CodeBlock from './code-block';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';

interface TiptapProps {
  initialHtml: string;
  onHtmlChange: (html: string) => void;
}

const lowlight = createLowlight(all);

function MenuBar() {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="flex gap-2 mb-5">
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={(editor.isActive('heading', { level: 1 }) ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800')}>
        <h1>Título</h1>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <h2>Subtítulo</h2>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <h3>Subsubtítulo</h3>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <b>N</b>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <i>i</i>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <s>S</s>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <code>Código</code>
      </Button>
      <Button onClick={() => editor.chain().focus().insertContent('$$\\sum$$', { applyInputRules: true }).run()} className="bg-slate-400 text-slate-800">
        <KaTeX>
          \sum
        </KaTeX>
      </Button>
      <Button onClick={() => editor.chain().focus().insertContent('$f(x)$', { applyInputRules: true }).run()} className="bg-slate-400 text-slate-800">
        <KaTeX inline>
          f(x)
        </KaTeX>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <ul>
          <li>Esto</li>
          <li>Y esto</li>
        </ul>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800'}>
        <ol>
          <li>Primero</li>
          <li>Segundo</li>
        </ol>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={(editor.isActive('codeBlock') ? 'bg-violet-600 text-white' : 'bg-slate-400 text-slate-800')}>
            <CodeBlock language='python'>{'print("Hola, mundo")'}</CodeBlock>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'python' }).run()}>
            Python
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'javascript' }).run()}>
            JavaScript
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'typescript' }).run()}>
            TypeScript
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'c' }).run()}>
            C
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Tiptap({ initialHtml, onHtmlChange }: TiptapProps) {
  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      }
    }),
    MathExtension,
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
  return (
    <>
      <EditorProvider slotBefore={<MenuBar />} content={initialHtml.length > 0 ? initialHtml : '<p>Comienza a escribir...</p>'} extensions={extensions} onUpdate={({ editor }) => onHtmlChange(editor.getHTML())} />
    </>
  )
}