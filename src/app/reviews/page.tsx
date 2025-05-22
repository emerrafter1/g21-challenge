"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [reviewRequestData, setReviewRequestData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/review-requests")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch review requests");
        return res.json();
      })
      .then((data) => {
        console.log(data[0].id);
        setReviewRequestData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
        {/* TODO: Add status filter component here */}
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            Replace this placeholder with your status filter component.
          </p>
        </div>

        {/* TODO: Add ReviewRequestTable component here */}
        <div>
          <p>


   
            {isLoading && (
              <p className="text-gray-600">Loading review requests...</p>
            )}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!isLoading && !error && (
              <div className="bg-white border p-4 rounded-md">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="border-b font-semibold">
                    <tr>
                      <th className="p-2">Client</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Priority</th>
                      <th className="p-2">Due Date</th>
                      <th className="p-2">Status</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
