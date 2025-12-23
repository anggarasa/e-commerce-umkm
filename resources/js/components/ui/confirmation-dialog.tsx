import { Button, buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import {
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    Info,
    Loader2,
    Trash2,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

type ConfirmationVariant =
    | 'default'
    | 'destructive'
    | 'warning'
    | 'info'
    | 'success';

interface ConfirmationDialogProps {
    /** Controls the open state of the dialog */
    open: boolean;
    /** Callback when the open state changes */
    onOpenChange: (open: boolean) => void;
    /** Title of the dialog */
    title: string;
    /** Description/message shown in the dialog */
    description: ReactNode;
    /** Callback function executed when the confirm button is clicked */
    onConfirm: () => void | Promise<void>;
    /** Visual variant of the dialog (default: "default") */
    variant?: ConfirmationVariant;
    /** Text for the confirm button (default: "Konfirmasi") */
    confirmText?: string;
    /** Text for the cancel button (default: "Batal") */
    cancelText?: string;
    /** Text shown while processing (default: "Memproses...") */
    processingText?: string;
    /** Custom icon to show in the dialog */
    icon?: ReactNode;
    /** Whether to show default icon based on variant */
    showIcon?: boolean;
}

const variantConfig: Record<
    ConfirmationVariant,
    {
        icon: ReactNode;
        iconContainerClass: string;
        confirmButtonVariant: VariantProps<typeof buttonVariants>['variant'];
    }
> = {
    default: {
        icon: <HelpCircle className="size-6" />,
        iconContainerClass: 'bg-muted text-muted-foreground',
        confirmButtonVariant: 'default',
    },
    destructive: {
        icon: <Trash2 className="size-6" />,
        iconContainerClass: 'bg-destructive/10 text-destructive',
        confirmButtonVariant: 'destructive',
    },
    warning: {
        icon: <AlertTriangle className="size-6" />,
        iconContainerClass: 'bg-amber-500/10 text-amber-500',
        confirmButtonVariant: 'default',
    },
    info: {
        icon: <Info className="size-6" />,
        iconContainerClass: 'bg-blue-500/10 text-blue-500',
        confirmButtonVariant: 'default',
    },
    success: {
        icon: <CheckCircle2 className="size-6" />,
        iconContainerClass: 'bg-green-500/10 text-green-500',
        confirmButtonVariant: 'default',
    },
};

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    variant = 'default',
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    processingText = 'Memproses...',
    icon,
    showIcon = true,
}: ConfirmationDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const config = variantConfig[variant];

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const displayIcon = icon ?? config.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {showIcon && (
                            <div
                                className={cn(
                                    'flex size-12 shrink-0 items-center justify-center rounded-full',
                                    config.iconContainerClass,
                                )}
                            >
                                {displayIcon}
                            </div>
                        )}
                        <div className="flex-1 space-y-2">
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription asChild>
                                <div>{description}</div>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isProcessing}>
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button
                        variant={config.confirmButtonVariant}
                        onClick={handleConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                {processingText}
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Hook to easily manage confirmation dialog state
 */
export function useConfirmationDialog() {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return {
        isOpen,
        setIsOpen,
        openDialog,
        closeDialog,
    };
}
