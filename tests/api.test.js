const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

const BASE_URL = process.env.TEST_APP_URL || "http://localhost:3000";

function fetchJson(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            resolve({ status: res.statusCode, data });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

test("Dashboard Overview API (/api/dashboard)", async (t) => {
  const res = await fetchJson("/api/dashboard?range=30d");
  assert.strictEqual(res.status, 200, "Dashboard API should return status 200");
  assert.ok(res.data.metrics, "Response should include metrics");
  assert.ok(res.data.metrics.totalBookings >= 500, "Should have 500+ total bookings");
  assert.ok(res.data.metrics.totalRevenue > 0, "Total revenue should be positive");
  assert.ok(Array.isArray(res.data.chartData), "Should contain chart series");
  assert.ok(Array.isArray(res.data.categoryBreakdown), "Should contain category breakdown");
  assert.ok(Array.isArray(res.data.statusBreakdown), "Should contain status breakdown");
});

test("Bookings List API with Search & Filters (/api/bookings)", async (t) => {
  const res = await fetchJson("/api/bookings?page=1&limit=10&status=ALL");
  assert.strictEqual(res.status, 200, "Bookings API should return status 200");
  assert.ok(Array.isArray(res.data.data), "Should return array of bookings");
  assert.strictEqual(res.data.data.length, 10, "Should return 10 bookings per page");
  assert.ok(res.data.pagination.total >= 500, "Total bookings count should be >= 500");

  const first = res.data.data[0];
  assert.ok(first.id.startsWith("IM-"), "Booking ID should follow format IM-XXXXX");
  assert.ok(first.customer, "Booking should include customer relationship");
});

test("Mechanics Fleet API (/api/mechanics)", async (t) => {
  const res = await fetchJson("/api/mechanics");
  assert.strictEqual(res.status, 200, "Mechanics API should return status 200");
  assert.ok(Array.isArray(res.data), "Should return array of mechanics");
  assert.ok(res.data.length >= 20, "Should have 20+ mechanics");

  const mech = res.data[0];
  assert.ok(mech.name, "Mechanic should have a name");
  assert.ok(mech.specialization, "Mechanic should have a specialization");
  assert.ok(typeof mech.rating === "number", "Rating should be a number");
  assert.ok(typeof mech.latitude === "number", "Latitude should be present");
});

test("Customers Directory API (/api/customers)", async (t) => {
  const res = await fetchJson("/api/customers");
  assert.strictEqual(res.status, 200, "Customers API should return status 200");
  assert.ok(Array.isArray(res.data), "Should return array of customers");
  assert.ok(res.data.length >= 50, "Should have 50+ registered customers");

  const cust = res.data[0];
  assert.ok(cust.name, "Customer should have a name");
  assert.ok(cust.email, "Customer should have an email");
  assert.ok(Array.isArray(cust.vehicles), "Customer should have vehicles array");
});

test("Live Operations Simulator Step API (/api/simulator)", async (t) => {
  const res = await fetchJson("/api/simulator", { method: "POST" });
  assert.strictEqual(res.status, 200, "Simulator step should return status 200");
  assert.ok(res.data.action, "Simulator should return an action outcome");
});

test("OpenAPI Documentation Spec API (/api/docs)", async (t) => {
  const res = await fetchJson("/api/docs");
  assert.strictEqual(res.status, 200, "API docs should return status 200");
  assert.strictEqual(res.data.openapi, "3.0.3", "Should be OpenAPI 3.0.3");
  assert.ok(res.data.paths["/dashboard"], "Should document /dashboard endpoint");
  assert.ok(res.data.paths["/bookings"], "Should document /bookings endpoint");
});
