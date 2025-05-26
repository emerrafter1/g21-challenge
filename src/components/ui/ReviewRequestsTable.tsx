import { useState } from "react";
import { ReviewRequest, Status } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toTitleCase } from "@/lib/utils";

interface ReviewRequestsTableProps {
  data: ReviewRequest[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

export default function ReviewRequestsTable({
  data: initialData,
  searchTerm,
  isLoading,
  error,
}: ReviewRequestsTableProps) {
  const [data, setData] = useState<ReviewRequest[]>([...initialData]);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedStatus, setEditedStatus] = useState<Status>("Pending");

  const statuses: Status[] = ["Pending", "In Review", "Completed"];

  if (isLoading) {
    return <p className="text-gray-600">Loading review requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  function handleEditClick(id: string, currentStatus: Status) {
    setEditRowId(id);
    setEditedStatus(currentStatus);
  }

  function handleStatusChange(value: Status) {
    setEditedStatus(value);
  }

  function handleSave(id: string) {
    const updated = data.map((item) =>
      item.id === id ? { ...item, status: editedStatus } : item
    );
    setData(updated);
    setEditRowId(null);
  }

  function handleCancel() {
    setEditRowId(null);
  }

  const filteredData = data.filter(
    (r) =>
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredData.length > 0 ? (
            filteredData.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.clientName}</td>
                <td className="p-2">{r.documentTitle}</td>
                <td className="p-2">{r.documentType}</td>
                <td className="p-2">{r.priority}</td>
                <td className="p-2">
                  {new Date(r.dueDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {editRowId === r.id ? (
                    <Select
                      value={editedStatus}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((item) => (
                          <SelectItem key={item} value={item}>
                            {toTitleCase(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    toTitleCase(r.status)
                  )}
                </td>
                <td className="p-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <Button className="m-1" variant="outline">
                    View
                  </Button>
                  {editRowId === r.id ? (
                    <>
                      <Button
                        className="m-1"
                        variant="outline"
                        onClick={() => handleSave(r.id)}
                      >
                        Save
                      </Button>
                      <Button
                        className="m-1"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="m-1"
                      variant="outline"
                      onClick={() => handleEditClick(r.id, r.status)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center">
                Your search <strong>{searchTerm}</strong> did not match any
                review requests.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
