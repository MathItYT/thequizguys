'use client'

import { useCurrentEditor, EditorProvider, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MathExtension from '@aarkue/tiptap-math-extension'
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
import { Toggle } from './ui/toggle';
import KaTeX from './katex';
import NextImage from 'next/image';
import Youtube from '@tiptap/extension-youtube'

interface TiptapProps {
  initialHtml: string;
  onHtmlChange: (html: string) => void;
  noImages?: boolean;
  noLinks?: boolean;
  noYoutube?: boolean;
}

interface MenuBarProps {
  noImages?: boolean;
  noLinks?: boolean;
  noYoutube?: boolean;
}

const lowlight = createLowlight(all);

function MenuBar({ noImages, noLinks, noYoutube }: MenuBarProps) {
  const { editor } = useCurrentEditor();

  const { toast } = useToast();
  const linkRef = React.useRef<HTMLInputElement>(null);
  const imageFileRef = React.useRef<HTMLInputElement>(null);
  const youtubeRef = React.useRef<HTMLInputElement>(null);
  const defaultWidth = 560;
  const defaultHeight = 315;

  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-col'>
      <div className="flex flex-wrap gap-2">
        <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} pressed={editor.isActive('heading', { level: 1 })}>
          <h1>Título</h1>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} pressed={editor.isActive('heading', { level: 2 })}>
          <h2>Subtítulo</h2>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} pressed={editor.isActive('heading', { level: 3 })}>
          <h3>Subsubtítulo</h3>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleBold().run()} pressed={editor.isActive('bold')}>
          <b>N</b>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleItalic().run()} pressed={editor.isActive('italic')}>
          <i>i</i>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleStrike().run()} pressed={editor.isActive('strike')}>
          <s>S</s>
        </Toggle>
        {
          !noLinks &&
          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Toggle pressed={editor.isActive('link')}>
              <LinkIcon />
            </Toggle>
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
        <Toggle onClick={() => editor.chain().focus().toggleCode().run()} pressed={editor.isActive('code')}>
          <code className='bg-transparent'>Código</code>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleBulletList().run()} pressed={editor.isActive('bulletList')}>
          <ul>
            <li>Esto</li>
            <li>Y esto</li>
          </ul>
        </Toggle>
        <Toggle onClick={() => editor.chain().focus().toggleOrderedList().run()} pressed={editor.isActive('orderedList')}>
          <ol>
            <li>Primero</li>
            <li>Segundo</li>
          </ol>
        </Toggle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle pressed={editor.isActive('codeBlock')}>
              <CodeBlock className='bg-transparent' language='python'>{'print("Hola, mundo")'}</CodeBlock>
            </Toggle>
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
            <Toggle pressed={editor.isActive('image')} >
              <ImageIcon />
            </Toggle>
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
        {
          !noYoutube &&
          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Toggle pressed={editor.isActive('youtube')}>
              <NextImage src='/youtube.svg' width={20} height={20} alt='YouTube Logo' />
            </Toggle>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Insertar video de YouTube</AlertDialogTitle>
              <AlertDialogDescription>Ingresa la URL del video de YouTube que deseas insertar</AlertDialogDescription>
            </AlertDialogHeader>
            <Input placeholder="URL" ref={youtubeRef} />
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => {
                if (!youtubeRef.current?.value) {
                  toast({
                    title: 'URL vacío',
                    description: 'Por favor, ingresa una URL válida de YouTube',
                    variant: 'destructive',
                  });
                  return;
                }
                const url = youtubeRef.current.value;
                if (!url) {
                  toast({
                    title: 'URL vacío',
                    description: 'Por favor, ingresa una URL válida de YouTube',
                    variant: 'destructive',
                  });
                  return;
                }
                const success = editor.commands.setYoutubeVideo({ src: url, width: defaultWidth, height: defaultHeight });
                if (!success) {
                  toast({
                    title: 'URL inválido',
                    description: 'Por favor, ingresa una URL válida de YouTube',
                    variant: 'destructive',
                  });
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
      <ul className='mb-5'>
        <li><p className='text-sm'>Ingresa <KaTeX inline>\LaTeX</KaTeX> con <code>$...$</code> para fórmulas en línea y <code>$$...$$</code> para fórmulas en bloque</p></li>
        {!noLinks && <li><p className='text-sm'>Para agregar una URL a un texto, selecciónalo de inicio a fin y presiona el botón de enlace</p></li>}
      </ul>
    </div>
  )
}

export default function Tiptap({ initialHtml, onHtmlChange, noImages, noLinks, noYoutube }: TiptapProps) {
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
    }),
    noYoutube ? null : Youtube,
  ].filter(extension => extension !== null) as Extension[];
  return (
    <>
      <EditorProvider slotBefore={<MenuBar noImages={noImages} noLinks={noLinks} noYoutube={noYoutube} />} content={initialHtml.length > 0 ? initialHtml : '<p>Comienza a escribir...</p>'} extensions={extensions} onUpdate={({ editor }) => {
        onHtmlChange(editor.getHTML());
      }} />
    </>
  )
}