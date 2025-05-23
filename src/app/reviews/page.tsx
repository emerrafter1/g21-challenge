"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ReviewRequest } from "@/types";

export default function ReviewsPage() {
  const [reviewRequestData, setReviewRequestData] = useState<ReviewRequest[]>([]);
  const [allReviewRequests, setAllReviewRequests] = useState<ReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    fetch("/api/review-requests")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dropdown data");
        return res.json();
      })
      .then((data) => {
        setAllReviewRequests(data);
      })
      .catch((err) => {
        console.error("Dropdown load error:", err.message);
      });
  }, []);

  const distinctDocumentTypes = Array.from(
    new Set(allReviewRequests.map((item) => item.documentType))
  );

  const distinctClientNames = Array.from(
    new Set(allReviewRequests.map((item) => item.clientName))
  );

  useEffect(() => {
    setIsLoading(true);

    const params = new URLSearchParams();

    if (requestStatus && requestStatus != "all")
      params.append("status", requestStatus);
    if (documentSearchTerm) params.append("documentTitle", documentSearchTerm);
    if (documentType && documentType != "all")
      params.append("documentType", documentType);
    if (clientName && clientName != "all")
      params.append("clientName", clientName);

    const url = `/api/review-requests?${params.toString()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch review requests");
        return res.json();
      })
      .then((data) => {
        setReviewRequestData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [requestStatus, documentSearchTerm, documentType, clientName]);

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Requests</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Review Requests</h2>
        <div className="mb-4">
          <input
            type="text"
            id="search"
            value={documentSearchTerm}
            onChange={(e) => setDocumentSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-4">
          <div className="mb-4 flex items-center ">
            <label className="mr-2 font-medium">Status:</label>
            <Select value={requestStatus} onValueChange={setRequestStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex items-center ">
            <label className="mr-2 font-medium">Document Type:</label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {distinctDocumentTypes.map((item, index) => {
                  return (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 flex items-center ">
            <label className="mr-2 font-medium">Client Name:</label>
            <Select value={clientName} onValueChange={setClientName}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {distinctClientNames.map((item, index) => {
                  return (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {isLoading && (
            <p className="text-gray-600">Loading review requests...</p>
          )}
          {error && <p className="text-red-500">Error: {error}</p>}

          {!isLoading && !error && (
            <div className="bg-white border p-4 rounded-md overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="border-b font-semibold">
                  <tr>
                    <th className="p-2">Client</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Created at</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewRequestData.length > 0 ? (
                    reviewRequestData.map((r) => (
                      <tr key={r.id} className="border-b">
                        <td className="p-2">{r.clientName}</td>
                        <td className="p-2">{r.documentTitle}</td>
                        <td className="p-2">{r.documentType}</td>
                        <td className="p-2">{r.priority}</td>
                        <td className="p-2">{r.dueDate}</td>
                        <td className="p-2">{r.status}</td>
                        <td className="p-2">{r.createdAt}</td>
                        <td className="p-2">
                          <Button className="m-1" variant="outline">
                            View
                          </Button>
                          <Button className="m-1" variant="outline">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center">
                        Your search <strong>{documentSearchTerm}</strong> did
                        not match any review requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
