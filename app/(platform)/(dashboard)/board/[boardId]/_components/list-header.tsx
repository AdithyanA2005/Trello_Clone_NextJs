import { useRef, useState } from "react";
import { List } from "@prisma/client";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import useAction from "@/hooks/useAction";
import { updateList } from "@/actions/update-list";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  list: List;
  onAddCard: () => void;
}

export function ListHeader({ list, onAddCard }: ListHeaderProps) {
  const [title, setTitle] = useState(list.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;
    const id = formData.get("id") as string;

    if (title === list.title) return disableEditing();
    await execute({ id, title, boardId });
  };
  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  // Disable editing by pressing `esc`
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };
  useEventListener("keydown", onKeyDown);

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="w-full">
          <input hidden readOnly id="id" name="id" value={list.id} />
          <input hidden readOnly id="boardId" name="boardId" value={list.boardId} />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title"
            defaultValue={title}
            className="flex h-7 items-center truncate border-none border-transparent bg-transparent px-2.5 py-1 text-sm font-medium leading-7 transition hover:border-input hover:bg-white focus:border-none focus:border-input"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <h2
          onClick={enableEditing}
          className="h-7 w-full cursor-pointer border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </h2>
      )}

      <ListOptions onAddCard={onAddCard} list={list} />
    </div>
  );
}
