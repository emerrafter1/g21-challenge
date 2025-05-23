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

export default function ReviewsPage() {
  const [reviewRequestData, setReviewRequestData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState("");

  useEffect(() => {
    setIsLoading(true);

    const url = requestStatus
      ? `/api/review-requests?status=${encodeURIComponent(requestStatus)}`
      : "/api/review-requests";

    console.log(url);

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
  }, [requestStatus]);

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

        <div className="mb-4 ">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Filter by status:
          </label>
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
                  {reviewRequestData.map((r) => (
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
                        </Button>{" "}
                        <Button className="m-1" variant="outline">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
