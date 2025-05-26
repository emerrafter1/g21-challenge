import { useState, useEffect } from "react";
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
  const [sortColumn, setSortColumn] =
    useState<keyof ReviewRequest>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const statuses: Status[] = ["Pending", "In Review", "Completed"];

  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

  if (isLoading) {
    return <p className="text-gray-600">Loading review requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">Oops! Something went wrong!</p>;
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

  function handleSort(column: keyof ReviewRequest) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  function renderHeader(label: string, column: keyof ReviewRequest) {
    const isActive = sortColumn === column;
    const icon = isActive ? (sortDirection === "asc" ? "▲" : "▼") : "⇅";
    const iconClass = isActive ? "text-black" : "text-gray-400";

    return (
      <th className="p-2 cursor-pointer" onClick={() => handleSort(column)}>
        <div className="flex items-center gap-1">
          <span>{label}</span>
          <span className={iconClass}>{icon}</span>
        </div>
      </th>
    );
  }

  function renderRow(r: ReviewRequest) {
    return (
      <tr key={r.id} className="border-b">
        <td className="p-2">{r.clientName}</td>
        <td className="p-2">{r.documentTitle}</td>
        <td className="p-2">{r.documentType}</td>
        <td className="p-2">{r.priority}</td>
        <td className="p-2">{new Date(r.dueDate).toLocaleDateString()}</td>
        <td className="p-2">
          {editRowId === r.id ? (
            <Select value={editedStatus} onValueChange={handleStatusChange}>
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
        <td className="p-2">{new Date(r.createdAt).toLocaleDateString()}</td>
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
              <Button className="m-1" variant="outline" onClick={handleCancel}>
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
    );
  }

  const priorityOrder: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const statusOrder: Record<string, number> = {
    Completed: 3,
    "In Review": 2,
    Pending: 1,
  };



  const sortedData = [...data].sort((a, b) => {
    const column = sortColumn || "createdAt";
    const valA = a[column];
    const valB = b[column];

    if (valA == null || valB == null) return 0;

    if (column === "dueDate" || column === "createdAt") {
      return sortDirection === "asc"
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime();
    }

    if (column === "priority") {
      const aPriority = priorityOrder[valA as string] || 0;
      const bPriority = priorityOrder[valB as string] || 0;
      return sortDirection === "asc"
        ? aPriority - bPriority
        : bPriority - aPriority;
    }

    if (column === "status") {
      const aStatus = statusOrder[valA as string] || 0;
      const bStatus = statusOrder[valB as string] || 0;
      return sortDirection === "asc" ? aStatus - bStatus : bStatus - aStatus;
    }

    const aStr = valA.toString().toLowerCase();
    const bStr = valB.toString().toLowerCase();

    return sortDirection === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return (
    <div className="bg-white border p-4 rounded-md overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b font-semibold">
          <tr>
            {renderHeader("Client", "clientName")}
            {renderHeader("Title", "documentTitle")}
            {renderHeader("Type", "documentType")}
            {renderHeader("Priority", "priority")}
            {renderHeader("Due Date", "dueDate")}
            {renderHeader("Status", "status")}
            {renderHeader("Created at", "createdAt")}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((r) => renderRow(r))
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
