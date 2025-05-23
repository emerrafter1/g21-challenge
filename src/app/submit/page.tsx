"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";


type FormData = {
  clientName: string;
  documentTitle: string;
  documentType: string;
  priority: string;
  dueDate: string;
  notes: string;
  file: File | null;
};

export default function SubmitPage() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    documentTitle: "",
    documentType: "",
    priority: "",
    dueDate: "",
    notes: "",
    file: null,
  });

  function handleChange(e: any) {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
  
    const { clientName, documentTitle, documentType, priority, dueDate } = formData;
  
    if (!clientName || !documentTitle || !documentType || !priority || !dueDate || !formData.file) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await fetch("/api/review-requests", {
        method: "POST",
        body: JSON.stringify({
          clientName,
          documentTitle,
          documentType,
          priority,
          dueDate,
          notes: formData.notes,
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
            <select
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select client</option>
              <option value="Acme Financial">Acme Financial</option>
              <option value="Birch Investments">Birch Investments</option>
              <option value="Coral Capital Management">
                Coral Capital Management
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Document title</label>
            <input
              type="text"
              name="documentTitle"
              value={formData.documentTitle}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Document type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="Financial Promotion">Financial Promotion</option>
              <option value="DDQ Response">DDQ Response</option>
              <option value="Risk Assessment">Risk Assessment</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Due date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={today}
              required
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
              required
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
