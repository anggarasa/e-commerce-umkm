import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface DeleteConfirmationDialogProps {
    /** The element that triggers the dialog when clicked */
    trigger: ReactNode;
    /** Title of the modal dialog */
    title: string;
    /** Description/message shown in the dialog */
    description: ReactNode;
    /** Callback function executed when the delete button is clicked */
    onConfirm: () => void | Promise<void>;
    /** Text for the confirm button (default: "Hapus") */
    confirmText?: string;
    /** Text for the cancel button (default: "Batal") */
    cancelText?: string;
    /** Text shown while deleting (default: "Menghapus...") */
    deletingText?: string;
}

export function DeleteConfirmationDialog({
    trigger,
    title,
    description,
    onConfirm,
    confirmText = 'Hapus',
    cancelText = 'Batal',
    deletingText = 'Menghapus...',
}: DeleteConfirmationDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            setIsOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription asChild>
                        <div>{description}</div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                {deletingText}
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
