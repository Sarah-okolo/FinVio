import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteModal({ ref, id }: { ref: string; id: string }) {
  console.log(id)
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-white bg-red-500/70 rounded-full cursor-pointer hover:bg-red-500/40  px-4 py-2">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-left md:pr-16 my-2 text-base font-medium">
            Are you sure you want to delete invoice{" "}
            <span className="min-w-max">
              # <span className="font-bold">{ref}</span>
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-end gap-5">
          <AlertDialogCancel className="font-bold text-muted-foreground hover:bg-muted-foreground/20 rounded-full cursor-pointer px-4 py-2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="text-white bg-red-500/70 rounded-full cursor-pointer hover:bg-red-500/40  px-4 py-2">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
