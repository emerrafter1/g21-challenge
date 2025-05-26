const { POST } = require("@/app/api/review-requests/route");
const { GET } = require("@/app/api/review-requests/route");

beforeEach(() => {
  jest.resetModules();
});

describe("GET /api/review-requests", () => {
  it("returns 200 and an array of review requests", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests",
    };

    const response = await GET(mockRequest);
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
    await jest.isolateModulesAsync(async () => {
      jest.mock("@/data/sample-data", () => ({
        SAMPLE_REVIEW_REQUESTS: null,
      }));

      const { GET: FaultyGET } = require("@/app/api/review-requests/route");

      const mockRequest = {
        url: "http://localhost/api/review-requests",
      };

      const response = await FaultyGET(mockRequest);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result).toHaveProperty("error");
      expect(result.error).toMatch(/failed to load/i);
    });
  });

  it("returns only review requests matching the given priority search param", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests?priority=High",
    };

    const response = await GET(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    result.forEach((entry) => {
      expect(entry.priority).toBe("High");
    });
  });

  it("returns only review requests matching the given status param", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests?status=pending",
    };

    const response = await GET(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    result.forEach((entry) => {
      expect(entry.status).toBe("Pending");
    });
  });

  it("returns only review requests matching the given documentType param", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests?documentType=Financial%20Promotion",
    };

    const response = await GET(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    result.forEach((entry) => {
      expect(entry.documentType).toBe("Financial Promotion");
    });
  });

  it("returns only review requests matching the given clientName param", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests?clientName=Acme%20Financial",
    };

    const response = await GET(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);

    result.forEach((entry) => {
      expect(entry.clientName).toBe("Acme Financial");
    });
  });

  it("returns only review requests matching the given documentTitle param", async () => {
    const mockRequest = {
      url: "http://localhost/api/review-requests?documentTitle=ess",
    };

    const response = await GET(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    result.forEach((entry) => {
      expect(entry.documentTitle).toContain("ess");
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
