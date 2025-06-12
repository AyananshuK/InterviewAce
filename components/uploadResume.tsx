"use client";

import { useState, useRef, useEffect } from "react";

const UploadResume = ({ pdfLink }: { pdfLink: string | undefined }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeLink, setResumeLink] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pdfLink) {
      setResumeLink(pdfLink);
    }
  }, [pdfLink]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setMessage("");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files allowed.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage("File must be 1MB or less.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/pdf-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResumeLink(data.pdfUrl);
        setMessage(`Uploaded successfully!`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(`Error: ${data.message || "Unknown error during upload"}`);
      }
    } catch (error) {
      setMessage(
        `Upload failed: ${(error as Error).message || "Network error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (resumeLink) {
      window.open(resumeLink, "_blank"); // Open the resume in a new tab
    }
  };

  return (
    <div className="p-6 w-full mx-auto bg-gray-800 rounded-xl shadow-md space-y-4 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 text-center mb-4">
        Your Resume
      </h2>

      <div className="flex gap-2 items-center justify-between w-full max-md:flex-col max-md:gap-3">
        {resumeLink && (
          <div className="flex flex-col items-center">
            <button
              onClick={handleViewResume}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out"
            >
              View Resume
            </button>
          </div>
        )}
        <div className="flex flex-col items-center">
          <label
            htmlFor="resume-upload"
            className="block text-sm font-medium text-gray-300 sr-only"
          >
            Upload PDF File
          </label>
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-100 border border-gray-600 rounded-4xl cursor-pointer bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-600 file:transition file:duration-300 file:ease-in-out"
          />
          {loading && (
            <p className="mt-2 text-blue-400 text-sm animate-pulse">
              Uploading...
            </p>
          )}
          {message && (
            <p
              className={`mt-2 text-sm ${
                message.includes("Error") ||
                message.includes("failed") ||
                message.includes("Only PDF") ||
                message.includes("1MB")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
