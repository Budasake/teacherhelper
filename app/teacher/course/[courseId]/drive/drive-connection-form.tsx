"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  courseId: string;
  initialFolderId: string;
  initialFolderName: string;
};

function extractFolderId(value: string) {
  const input = value.trim();

  if (!input) return null;

  if (!input.includes("://")) {
    return input;
  }

  try {
    const url = new URL(input);

    if (
      url.hostname !== "drive.google.com" &&
      url.hostname !== "docs.google.com"
    ) {
      return null;
    }

    const match = url.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);

    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function DriveConnectionForm({
  courseId,
  initialFolderId,
  initialFolderName,
}: Props) {
  const router = useRouter();

  const [folderLink, setFolderLink] = useState(initialFolderId);
  const [folderName, setFolderName] = useState(initialFolderName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const folderId = extractFolderId(folderLink);

    if (!folderId || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
      setError("Enter a valid Google Drive folder link or folder ID.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("course_drive_sources")
      .upsert(
        {
          course_id: courseId,
          drive_folder_id: folderId,
          drive_folder_name: folderName.trim() || null,
          sync_enabled: true,
          sync_status: "not_synced",
          last_sync_error: null,
          created_by: user.id,
        },
        { onConflict: "course_id" }
      );

    setLoading(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setSuccess("Google Drive folder reference saved successfully.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="folderName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Folder name
        </label>

        <input
          id="folderName"
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
          placeholder="CS101 - Introduction to Programming"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="folderLink"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Google Drive folder link or ID
        </label>

        <input
          id="folderLink"
          value={folderLink}
          onChange={(event) => setFolderLink(event.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <p className="mt-2 text-xs text-gray-500">
          Copy the link by opening the course folder in Google Drive
          and selecting Share → Copy link.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Google Drive folder"}
      </button>
    </form>
  );
}
