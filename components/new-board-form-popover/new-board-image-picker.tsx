"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { Random } from "unsplash-js/dist/methods/photos/types";
import { FormErrors } from "@/components/form/form-errors";
import { defaultUnsplashBoardImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export function NewBoardImagePicker({ id, errors }: FormPickerProps) {
  const [images, setImages] = useState<Random[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { pending } = useFormStatus();

  useEffect(() => {
    (async function () {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const newImages = result.response as Random[];
          setImages(newImages);
        } else {
          console.error("Failed to get images from unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultUnsplashBoardImages);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2Icon className="size-6 animate-spin text-sky-700" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-2 grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-video h-[52px] cursor-pointer bg-muted transition hover:opacity-90",
              pending && "cursor-auto opacity-50 hover:opacity-50",
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            {/*Not visible input element to get the image details in the form action*/}
            <input
              readOnly={true}
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              // NOTE: The pipe seperated data will be accessed in the form action
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />

            <Image fill src={image.urls.thumb} alt="Board Cover" className="rounded-sm object-cover" />

            {selectedImageId === image.id ? (
              <div className="absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/30">
                <CheckIcon className="size-4 text-white" />
              </div>
            ) : null}

            <Link
              href={image.links.html}
              target="_blank"
              className="absolute bottom-0 w-full truncate bg-black/50 p-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>

      <FormErrors id={id} errors={errors} />
    </div>
  );
}
