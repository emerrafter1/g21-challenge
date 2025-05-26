import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_REVIEW_REQUESTS } from "@/data/sample-data";

export function GET(request: NextRequest) {
  try {
    if (!Array.isArray(SAMPLE_REVIEW_REQUESTS)) {
      throw new Error("Invalid review requests data");
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status")?.toLowerCase();
    const documentTitle = searchParams.get("documentTitle")?.trim().toLowerCase();
    const documentType = searchParams.get("documentType")?.toLowerCase();
    const clientName = searchParams.get("clientName")?.toLowerCase();
    const priority = searchParams.get("priority")?.toLowerCase();
    

    let filteredData = SAMPLE_REVIEW_REQUESTS;

    if (statusFilter) {
        filteredData = filteredData.filter(
          (item) => item.status.toLowerCase() === statusFilter
        );
      }
      
      if (documentTitle) {
        filteredData = filteredData.filter((item) =>
          item.documentTitle.toLowerCase().includes(documentTitle)
        );
      }
      
      if (documentType) {
        filteredData = filteredData.filter(
          (item) => item.documentType.toLowerCase() === documentType
        );
      }
      
      if (clientName) {
        filteredData = filteredData.filter(
          (item) => item.clientName.toLowerCase() === clientName
        );
      }
      
      if (priority) {
        filteredData = filteredData.filter(
          (item) => item.priority.toLowerCase() === priority
        );
      }

    return NextResponse.json(filteredData);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load review requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = [
      "clientName",
      "documentTitle",
      "documentType",
      "priority",
      "dueDate",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Bad Request: Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    let newId = String(SAMPLE_REVIEW_REQUESTS.length + 1);

    const newRequest = {
      id: newId,
      ...body,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
