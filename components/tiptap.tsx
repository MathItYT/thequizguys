'use client'

import { Button } from '@/components/ui/button';
import { useCurrentEditor, EditorProvider, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MathExtension from '@aarkue/tiptap-math-extension'
import KaTeX from './katex';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import CodeBlock from './code-block';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import Link from '@tiptap/extension-link';
import { Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from '@tiptap/extension-image';
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface TiptapProps {
  initialHtml: string;
  onHtmlChange: (html: string) => void;
  noImages?: boolean;
  noLinks?: boolean;
}

const lowlight = createLowlight(all);

function MenuBar({ noImages, noLinks }: { noImages?: boolean, noLinks?: boolean }) {
  const { editor } = useCurrentEditor();

  const { toast } = useToast();
  const linkRef = React.useRef<HTMLInputElement>(null);
  const imageFileRef = React.useRef<HTMLInputElement>(null);

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={(editor.isActive('heading', { level: 1 }) ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800')}>
        <h1>Título</h1>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <h2>Subtítulo</h2>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <h3>Subsubtítulo</h3>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <b>N</b>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <i>i</i>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <s>S</s>
      </Button>
      {
        !noLinks &&
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className={(editor.isActive('link') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800')}>
            <LinkIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-4/5 rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Insertar o eliminar enlace</AlertDialogTitle>
            <AlertDialogDescription>Ingresa la URL del enlace que deseas insertar. En caso de eliminar, deja el campo vacío</AlertDialogDescription>
          </AlertDialogHeader>
          <Input ref={linkRef} placeholder="URL" defaultValue={editor.isActive('link') ? editor.getAttributes('link').href : ''} />
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              if (!linkRef.current?.value && !editor.isActive('link')) {
                toast({
                  title: 'URL vacío',
                  description: 'Por favor, ingresa una URL',
                  variant: 'destructive',
                });
                return;
              } else if (!linkRef.current?.value) {
                editor.chain().focus().unsetLink().run();
                return;
              }
              editor.chain().focus().toggleLink({ href: linkRef.current.value }).run();
            }}>
              Aceptar
            </AlertDialogAction>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      }
      <Button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
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
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <ul>
          <li>Esto</li>
          <li>Y esto</li>
        </ul>
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800'}>
        <ol>
          <li>Primero</li>
          <li>Segundo</li>
        </ol>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={(editor.isActive('codeBlock') ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-400 hover:bg-slate-500 text-slate-800')}>
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
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock({ language: 'latex' }).run()}>
            LaTeX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            Desactivar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {
        !noImages &&
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-slate-400 text-slate-800">
            <ImageIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insertar imagen</AlertDialogTitle>
            <AlertDialogDescription>Sube el archivo de la imagen que quieres insertar</AlertDialogDescription>
          </AlertDialogHeader>
          <Input type="file" datatype='image/*' ref={imageFileRef} />
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              if (!imageFileRef.current?.files) {
                toast({
                  title: 'Archivo vacío',
                  description: 'Por favor, selecciona un archivo',
                  variant: 'destructive',
                });
                return;
              }
              const files = imageFileRef.current.files;
              const reader = new FileReader();
              reader.onload = () => {
                editor.chain().focus().setImage({ src: reader.result as string }).run();
              }
              for (let i = 0; i < files.length; i++) {
                if (files[i].type.startsWith('image/')) {
                  reader.readAsDataURL(files[i]);
                  break;
                }
              }
            }}>
              Aceptar
            </AlertDialogAction>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      }
    </div>
  )
}

export default function Tiptap({ initialHtml, onHtmlChange, noImages, noLinks }: TiptapProps) {
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
    noLinks ? null : Link,
    noImages ? null : Image.configure({
      inline: false,
      allowBase64: true,
    })
  ].filter(extension => extension !== null) as Extension[];
  return (
    <>
      <EditorProvider slotBefore={<MenuBar noImages={noImages} noLinks={noLinks} />} content={initialHtml.length > 0 ? initialHtml : '<p>Comienza a escribir...</p>'} extensions={extensions} onUpdate={({ editor }) => {
        onHtmlChange(editor.getHTML());
      }} />
    </>
  )
}