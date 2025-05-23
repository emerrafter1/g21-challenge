import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_REVIEW_REQUESTS } from "@/data/sample-data";

export function GET(request: NextRequest) {
  try {
    if (!Array.isArray(SAMPLE_REVIEW_REQUESTS)) {
      throw new Error("Invalid review requests data");
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const documentTitle = searchParams.get("documentTitle")

    let filteredData = SAMPLE_REVIEW_REQUESTS;

    if (statusFilter && statusFilter!="all") {
      filteredData = filteredData.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (documentTitle) {
        filteredData = filteredData.filter((item) =>
          item.documentTitle.toLowerCase().includes(documentTitle.toLowerCase())
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
