const { POST } = require("@/app/api/review-requests/route");
const { GET } = require("@/app/api/review-requests/route");

describe("GET /api/review-requests", () => {
  it("returns 200 and an array of review requests", async () => {
    const response = GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);

    const expectedKeys = [
      "id",
      "clientName",
      "documentTitle",
      "documentType",
      "priority",
      "dueDate",
      "notes",
      "status",
      "createdAt",
    ];

    result.forEach((entry) => {
      expectedKeys.forEach((key) => {
        expect(entry).toHaveProperty(key);
      });
    });
  });

  it("returns 500 if SAMPLE_REVIEW_REQUESTS is not an array", async () => {
    jest.isolateModules(() => {
      jest.mock("@/data/sample-data", () => ({
        SAMPLE_REVIEW_REQUESTS: null,
      }));

      const { GET: FaultyGET } = require("@/app/api/review-requests/route");
      const response = FaultyGET();

      return response.json().then((result) => {
        expect(response.status).toBe(500);
        expect(result).toHaveProperty("error");
        expect(result.error).toMatch(/failed to load/i);
      });
    });
  });
});

describe("POST /api/review-requests", () => {
  it("returns 201 and auto-fills createdAt", async () => {
    const mockRequest = {
      json: async () => ({
        clientName: "Coral Capital Management",
        documentTitle: "New Brochure",
        documentType: "Financial Promotion",
        priority: "High",
        dueDate: "2025-04-20",
        notes: "New launch – high priority",
      }),
    };

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(201);

    const today = new Date().toISOString().slice(0, 10);

    expect(result).toMatchObject({
      id: "6",
      clientName: "Coral Capital Management",
      documentTitle: "New Brochure",
      documentType: "Financial Promotion",
      priority: "High",
      notes: "New launch – high priority",
      status: "Pending",
      dueDate: "2025-04-20",
      createdAt: today,
    });

  });

  it("returns 400 for missing fields", async () => {
    const mockRequest = {
      json: async () => ({
        clientName: "Coral Capital Management",
        documentTitle: "New Brochure",
        priority: "High",
        dueDate: "2025-04-20",
        notes: "Missing documentType",
      }),
    };

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toHaveProperty("error");
    expect(result.error).toBe("Bad Request: Missing field: documentType");
  });
});
