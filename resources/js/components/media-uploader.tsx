import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePlus, Star, Trash2, Video } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export interface MediaItem {
    id: string; // Temporary ID for new files, or DB ID for existing
    file?: File;
    preview: string;
    type: 'image' | 'video';
    is_primary: boolean;
    is_existing: boolean;
}

interface Props {
    media: MediaItem[];
    onChange: (media: MediaItem[]) => void;
}

export function MediaUploader({ media, onChange }: Props) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newMedia = acceptedFiles.map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' : 'image',
                is_primary: false,
                is_existing: false,
            })) as MediaItem[];

            // If it's the first media, make it primary
            if (media.length === 0 && newMedia.length > 0) {
                newMedia[0].is_primary = true;
            }

            onChange([...media, ...newMedia]);
        },
        [media, onChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': [],
        },
    });

    const removeMedia = (id: string) => {
        const newMedia = media.filter((m) => m.id !== id);
        // If we removed the primary, make the first one primary
        if (media.find((m) => m.id === id)?.is_primary && newMedia.length > 0) {
            newMedia[0].is_primary = true;
        }
        onChange(newMedia);
    };

    const setPrimary = (id: string) => {
        const newMedia = media.map((m) => ({
            ...m,
            is_primary: m.id === id,
        }));
        onChange(newMedia);
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:bg-accent/50',
                    isDragActive && 'border-primary bg-accent/50',
                )}
            >
                <input {...getInputProps()} />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ImagePlus className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-4">
                    <p className="text-sm font-medium">
                        Drop images or videos here, or click to select
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Supports JPG, PNG, MP4, etc.
                    </p>
                </div>
            </div>

            {media.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'group relative aspect-square overflow-hidden rounded-lg border bg-background',
                                item.is_primary &&
                                    'ring-2 ring-primary ring-offset-2',
                            )}
                        >
                            {item.type === 'video' ? (
                                <video
                                    src={item.preview}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <img
                                    src={item.preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            )}

                            {item.type === 'video' && (
                                <div className="absolute top-2 left-2 rounded-full bg-black/50 p-1 text-white">
                                    <Video className="h-3 w-3" />
                                </div>
                            )}

                            <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeMedia(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant={
                                            item.is_primary
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        size="sm"
                                        className="h-6 text-[10px]"
                                        onClick={() => setPrimary(item.id)}
                                    >
                                        {item.is_primary ? (
                                            <>
                                                <Star className="mr-1 h-3 w-3 fill-current" />
                                                Primary
                                            </>
                                        ) : (
                                            'Set Primary'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
