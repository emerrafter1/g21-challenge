"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ReviewRequest } from "@/types";
import ReviewRequestsTable from "@/components/ui/ReviewRequestsTable";
import FilterDropdown from "@/components/ui/FilterDropdown";

export default function ReviewsPage() {
  const [reviewRequestData, setReviewRequestData] = useState<ReviewRequest[]>(
    []
  );
  const [allReviewRequests, setAllReviewRequests] = useState<ReviewRequest[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [clientName, setClientName] = useState("");
  const statuses = [ "pending",  "in review","completed"]

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

  const trimmedTitle = documentSearchTerm.trim();

  useEffect(() => {
    setIsLoading(true);

    const params = new URLSearchParams();

    if (requestStatus && requestStatus != "all")
      params.append("status", requestStatus);
    if (trimmedTitle) params.append("documentTitle", trimmedTitle);
    
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

          <FilterDropdown
            label="Status"
            value={requestStatus}
            options={statuses}
            onChange={setRequestStatus}
          />

          <FilterDropdown
            label="Document Type"
            value={documentType}
            options={distinctDocumentTypes}
            onChange={setDocumentType}
          />

          <FilterDropdown
            label="Client Name"
            value={clientName}
            options={distinctClientNames}
            onChange={setClientName}
          />
        </div>
        <ReviewRequestsTable
          data={reviewRequestData}
          searchTerm={documentSearchTerm}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
}
