import { ReviewRequest } from "@/types";
import { Button } from "@/components/ui/button";

interface ReviewRequestsTableProps {
  data: ReviewRequest[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

export default function ReviewRequestsTable({
  data,
  searchTerm,
  isLoading,
  error,
}: ReviewRequestsTableProps) {
  if (isLoading) {
    return <p className="text-gray-600">Loading review requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
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
          {data.length > 0 ? (
            data.map((r) => (
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
                Your search <strong>{searchTerm}</strong> did not match any review requests.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
