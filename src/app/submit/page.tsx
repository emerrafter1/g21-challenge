"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import type { DocumentType, FormData, Priority } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FormDataSchema = z.object({
  clientName: z.string(),
  documentTitle: z.string(),
  documentType: z.enum([
    "Financial Promotion",
    "DDQ Response",
    "Risk Assessment",
  ]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string(),
  notes: z.string(),
  
});

export default function SubmitPage() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    documentTitle: "",
    documentType: "" as DocumentType | "",
    priority: "" as Priority | "",
    dueDate: "",
    notes: "",
    file: null,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files } = target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  }
  
  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formDataCheck = FormDataSchema.safeParse(formData);

    if (!formDataCheck.success) {
      return alert("Validation failed. Please check your input.");
    }

    const validatedFormData = formDataCheck.data;

    try {
      const response = await fetch("/api/review-requests", {
        method: "POST",
        body: JSON.stringify({
          clientName: validatedFormData.clientName,
          documentTitle: validatedFormData.documentTitle,
          documentType: validatedFormData.documentType,
          priority: validatedFormData.priority,
          dueDate: validatedFormData.dueDate,
          notes: validatedFormData.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error || "Unknown error"}`);
        return;
      }

      alert("Review request submitted successfully.");
      setFormData({
        clientName: "",
        documentTitle: "",
        documentType: "",
        priority: "",
        dueDate: "",
        notes: "",
        file: null,
      });
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to submit. Try again later.");
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submit New Review Request</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Client name</label>
            <Select
              value={formData.clientName}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, clientName: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="test">Select client</SelectItem>
                <SelectItem value="Acme Financial">Acme Financial</SelectItem>
                <SelectItem value="Birch Investments">
                  Birch Investments
                </SelectItem>
                <SelectItem value="Coral Capital Management">
                  Coral Capital Management
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Document title</label>
            <input
              type="text"
              name="documentTitle"
              value={formData.documentTitle}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Document type</label>
            <Select
              value={formData.documentType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  documentType: value as DocumentType,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financial Promotion">
                  Financial Promotion
                </SelectItem>
                <SelectItem value="DDQ Response">DDQ Response</SelectItem>
                <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: value as Priority,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Due date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={today}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">File Upload</label>
            {formData.file ? (
              <div className="w-full border rounded px-3 py-2 flex justify-between items-center">
                <span className="text-gray-800 text-base truncate max-w-[90%]">
                  {formData.file.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, file: null }))
                  }
                  className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs"
                  aria-label="Remove file"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <p className="text-gray-600 text-sm">
                  Drop your file or{" "}
                  <span className="underline text-black font-medium cursor-pointer">
                    upload
                  </span>
                </p>
              </div>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </main>
  );
}
