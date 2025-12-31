'use client';

import { cn } from '@/lib/utils';
import { useSyncExternalStore } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
];

// Helper for useSyncExternalStore to detect client-side mounting
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tulis konten di sini...',
    className,
    id,
}: RichTextEditorProps) {
    // useSyncExternalStore is the recommended way to detect client-side mounting
    // without triggering the set-state-in-effect ESLint error
    const mounted = useSyncExternalStore(
        emptySubscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    if (!mounted) {
        return (
            <div
                className={cn(
                    'min-h-[200px] rounded-md border border-input bg-background',
                    className,
                )}
            >
                <div className="flex h-[42px] items-center border-b border-input bg-muted/50 px-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                </div>
                <div className="p-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div
            id={id}
            className={cn(
                'rich-text-editor overflow-hidden rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring',
                className,
            )}
        >
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
