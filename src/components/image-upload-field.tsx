"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"

export function ImageUploadField({
  value,
  onChange,
  fallbackText,
}: {
  value?: string | null
  onChange: (url: string) => void
  fallbackText: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFile(file: File) {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "Upload failed")
        return
      }

      onChange(result.url)
      toast.success("Photo uploaded")
    } catch (err) {
      toast.error("Upload failed. Try again.")
    } finally {
      setIsUploading(false)
    }
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={value ?? undefined} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={onFileSelected}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {value ? "Replace photo" : "Upload photo"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              disabled={isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WEBP, or GIF. Max 5MB.
        </p>
      </div>
    </div>
  )
}