import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Table as TableIcon, Youtube as YoutubeIcon,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Strikethrough, Quote, Minus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TEXT_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Yellow', value: '#CA8A04' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Pink', value: '#DB2777' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: '' },
  { name: 'Yellow', value: '#FEF08A' },
  { name: 'Green', value: '#BBF7D0' },
  { name: 'Blue', value: '#BFDBFE' },
  { name: 'Pink', value: '#FBCFE8' },
  { name: 'Purple', value: '#E9D5FF' },
  { name: 'Orange', value: '#FED7AA' },
];

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            class: 'font-[Geist]',
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-300',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 bg-slate-100 p-2 font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-2',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({ src: youtubeUrl });
      setYoutubeUrl('');
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setTextSize = (size: 'small' | 'normal' | 'large') => {
    const sizes = {
      small: '14px',
      normal: '16px',
      large: '20px',
    };
    
    if (size === 'normal') {
      editor.chain().focus().unsetMark('textStyle').run();
    } else {
      editor.chain().focus().setMark('textStyle', { fontSize: sizes[size] }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-slate-200' : ''}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-slate-200' : ''}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive('subscript') ? 'bg-slate-200' : ''}
          title="Subscript"
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive('superscript') ? 'bg-slate-200' : ''}
          title="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

        {/* Text Size */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Text Size">
              <span className="text-xs font-medium">Size</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTextSize('small')}>
              <span className="text-sm">Small</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextSize('normal')}>
              <span className="text-base">Normal</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextSize('large')}>
              <span className="text-lg">Large</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text Color */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Text Color">
              <span className="text-xs font-medium underline decoration-2" style={{ textDecorationColor: editor.getAttributes('textStyle').color || '#000' }}>A</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {TEXT_COLORS.map((color) => (
              <DropdownMenuItem
                key={color.name}
                onClick={() => {
                  if (color.value) {
                    editor.chain().focus().setColor(color.value).run();
                  } else {
                    editor.chain().focus().unsetColor().run();
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border" 
                    style={{ backgroundColor: color.value || 'transparent' }}
                  />
                  {color.name}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Highlight */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className={editor.isActive('highlight') ? 'bg-slate-200' : ''}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {HIGHLIGHT_COLORS.map((color) => (
              <DropdownMenuItem
                key={color.name}
                onClick={() => {
                  if (color.value) {
                    editor.chain().focus().toggleHighlight({ color: color.value }).run();
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border" 
                    style={{ backgroundColor: color.value || 'transparent' }}
                  />
                  {color.name}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

        {/* Text Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200' : ''}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200' : ''}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200' : ''}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200' : ''}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Quote */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Horizontal Rule */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-slate-200' : ''}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        {/* Table */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              title="Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={insertTable}>
              Insert Table (3x3)
            </DropdownMenuItem>
            {editor.can().addColumnBefore() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                Add Column Before
              </DropdownMenuItem>
            )}
            {editor.can().addColumnAfter() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                Add Column After
              </DropdownMenuItem>
            )}
            {editor.can().addRowBefore() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                Add Row Before
              </DropdownMenuItem>
            )}
            {editor.can().addRowAfter() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                Add Row After
              </DropdownMenuItem>
            )}
            {editor.can().deleteColumn() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                Delete Column
              </DropdownMenuItem>
            )}
            {editor.can().deleteRow() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                Delete Row
              </DropdownMenuItem>
            )}
            {editor.can().deleteTable() && (
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
                Delete Table
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* YouTube */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              title="Insert YouTube Video"
            >
              <YoutubeIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Insert YouTube Video</h4>
                <p className="text-sm text-muted-foreground">
                  Paste the YouTube video URL below.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <Button type="button" onClick={addYoutube} disabled={!youtubeUrl}>
                Insert Video
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Second toolbar row for additional controls */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50/50 text-xs">
        <span className="text-muted-foreground self-center mr-2">Line Spacing:</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            editor.chain().focus().updateAttributes('paragraph', { style: 'line-height: 1.2' }).run();
          }}
        >
          Tight
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            editor.chain().focus().updateAttributes('paragraph', { style: 'line-height: 1.5' }).run();
          }}
        >
          Normal
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            editor.chain().focus().updateAttributes('paragraph', { style: 'line-height: 2' }).run();
          }}
        >
          Relaxed
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
