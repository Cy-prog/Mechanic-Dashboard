const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CUSTOMER_NAMES = [
  "Alexander Wright", "Sophia Martinez", "Marcus Vance", "Olivia Chen", "Liam Johnson",
  "Emma Davis", "Noah Wilson", "Ava Taylor", "Ethan Anderson", "Isabella Thomas",
  "James Jackson", "Mia White", "Benjamin Harris", "Charlotte Martin", "Lucas Thompson",
  "Amelia Garcia", "Henry Robinson", "Harper Clark", "Mason Rodriguez", "Evelyn Lewis",
  "Oliver Lee", "Abigail Walker", "Elijah Hall", "Emily Allen", "Daniel Young",
  "Elizabeth Hernandez", "Matthew King", "Mila Wright", "Aiden Lopez", "Ella Hill",
  "Jackson Scott", "Avery Green", "David Adams", "Sofia Baker", "Joseph Gonzalez",
  "Camila Nelson", "Samuel Carter", "Aria Mitchell", "Sebastian Perez", "Scarlett Roberts",
  "Jack Turner", "Victoria Phillips", "Owen Campbell", "Madison Parker", "Wyatt Evans",
  "Luna Edwards", "John Collins", "Grace Stewart", "Luke Sanchez", "Chloe Morris",
  "Gabriel Rogers", "Penelope Reed", "Anthony Cook", "Layla Morgan", "Dylan Bell",
  "Riley Murphy", "Leo Bailey", "Zoey Rivera", "Julian Cooper", "Nora Richardson",
  "Christopher Cox", "Lily Howard", "Joshua Ward", "Eleanor Torres", "Andrew Peterson"
];

const MECHANIC_DATA = [
  { name: "Carlos Mendez", spec: "Master Engine Diagnostic & OBD", rating: 4.96, lat: 37.7749, lng: -122.4194 },
  { name: "Devon Brooks", spec: "Brakes, Rotors & Suspension", rating: 4.88, lat: 37.7833, lng: -122.4167 },
  { name: "Vikram Patel", spec: "EV & Hybrid Powertrain Systems", rating: 4.98, lat: 37.7690, lng: -122.4467 },
  { name: "Sarah Jenkins", spec: "Transmission & Drivetrain", rating: 4.92, lat: 37.7599, lng: -122.4148 },
  { name: "Derrick Vance", spec: "Electrical & Alternator Systems", rating: 4.79, lat: 37.7925, lng: -122.4082 },
  { name: "Elena Rostova", spec: "Full AC & Climate Control Overhaul", rating: 4.94, lat: 37.7510, lng: -122.4200 },
  { name: "Marcus Thorne", spec: "Heavy Duty & Fleet Maintenance", rating: 4.85, lat: 37.7650, lng: -122.3950 },
  { name: "Zackary Taylor", spec: "Express Lube & Filter Tuneup", rating: 4.80, lat: 37.7800, lng: -122.4300 },
  { name: "Rajesh Kumar", spec: "ECU Tuning & Sensor Calibration", rating: 4.95, lat: 37.7880, lng: -122.4010 },
  { name: "Tyler Brooks", spec: "Cooling Systems & Radiator Repair", rating: 4.76, lat: 37.7600, lng: -122.4350 },
  { name: "Antonio Rossi", spec: "Exhaust, Catalytic & Emissions", rating: 4.89, lat: 37.7710, lng: -122.4110 },
  { name: "Brett Campbell", spec: "Suspension, Struts & Alignment", rating: 4.83, lat: 37.7950, lng: -122.4220 },
  { name: "Mateo Alvarez", spec: "Mobile Tire Balancing & Punctures", rating: 4.87, lat: 37.7450, lng: -122.4180 },
  { name: "Kevin Zhang", spec: "Battery Jump & High-Voltage Systems", rating: 4.91, lat: 37.7810, lng: -122.4490 },
  { name: "Jordan Smith", spec: "Fuel Injection & Intake Cleaning", rating: 4.78, lat: 37.7670, lng: -122.4100 },
  { name: "Dmitri Ivanov", spec: "German Car Specialist (BMW/Audi/Merc)", rating: 4.97, lat: 37.7900, lng: -122.4350 },
  { name: "Brandon Ortiz", spec: "Clutch & Flywheel Replacement", rating: 4.86, lat: 37.7550, lng: -122.4050 },
  { name: "Leon Walker", spec: "Emergency Roadside Recovery", rating: 4.93, lat: 37.7780, lng: -122.4250 },
  { name: "Travis Scott", spec: "Ignition Coils & Spark Plugs", rating: 4.81, lat: 37.7630, lng: -122.4280 },
  { name: "Nathan Drake", spec: "Steering Rack & Power Steering", rating: 4.84, lat: 37.7850, lng: -122.4090 },
  { name: "Lucas Meyer", spec: "Turbocharger & Supercharger Service", rating: 4.95, lat: 37.7700, lng: -122.4380 },
  { name: "Aaron Paul", spec: "Pre-Purchase Vehicle Inspection", rating: 4.88, lat: 37.7580, lng: -122.4190 },
  { name: "Sean Murphy", spec: "Timing Belt & Water Pump", rating: 4.90, lat: 37.7820, lng: -122.4150 },
  { name: "Gabriel Silva", spec: "Brake Fluid Flush & ABS Repair", rating: 4.87, lat: 37.7660, lng: -122.4410 },
  { name: "Liam O'Connor", spec: "Comprehensive 50-Point Road Check", rating: 4.92, lat: 37.7760, lng: -122.4030 }
];

const CAR_MODELS = [
  { make: "Toyota", model: "Camry" },
  { make: "Toyota", model: "RAV4" },
  { make: "Honda", model: "Civic" },
  { make: "Honda", model: "CR-V" },
  { make: "Ford", model: "F-150" },
  { make: "Ford", model: "Mustang" },
  { make: "Tesla", model: "Model 3" },
  { make: "Tesla", model: "Model Y" },
  { make: "BMW", model: "330i xDrive" },
  { make: "BMW", model: "X5" },
  { make: "Audi", model: "A4 Quattro" },
  { make: "Audi", model: "Q5" },
  { make: "Mercedes-Benz", model: "C300" },
  { make: "Mercedes-Benz", model: "GLC 300" },
  { make: "Hyundai", model: "Elantra" },
  { make: "Hyundai", model: "Tucson" },
  { make: "Chevrolet", model: "Silverado" },
  { make: "Chevrolet", model: "Tahoe" },
  { make: "Subaru", model: "Outback" },
  { make: "Mazda", model: "CX-5" }
];

const SERVICES = [
  { category: "Emergency Breakdown", name: "Roadside Engine Stall Recovery", baseAmount: 220, duration: 45, priority: "EMERGENCY" },
  { category: "Emergency Breakdown", name: "Mobile Jumpstart & Alternator Test", baseAmount: 95, duration: 30, priority: "HIGH" },
  { category: "Brake & Tires", name: "Ceramic Brake Pad & Rotor Replacement", baseAmount: 340, duration: 75, priority: "HIGH" },
  { category: "Brake & Tires", name: "Mobile Flat Tire Repair & Pressure Balancing", baseAmount: 110, duration: 40, priority: "MEDIUM" },
  { category: "Periodic Maintenance", name: "Full Synthetic Oil + Filter + 25-Point Inspection", baseAmount: 145, duration: 50, priority: "LOW" },
  { category: "Periodic Maintenance", name: "Major 60,000 Mile Scheduled Service", baseAmount: 490, duration: 120, priority: "MEDIUM" },
  { category: "Engine Diagnostics", name: "OBD-II Computer Diagnostic & Sensor Mapping", baseAmount: 160, duration: 45, priority: "HIGH" },
  { category: "Engine Diagnostics", name: "Spark Plugs & Ignition Coil Pack Overhaul", baseAmount: 280, duration: 60, priority: "MEDIUM" },
  { category: "Battery & Electrical", name: "AGM Battery Replacement & Registration", baseAmount: 260, duration: 35, priority: "HIGH" },
  { category: "Battery & Electrical", name: "Starter Motor Replacement", baseAmount: 390, duration: 90, priority: "HIGH" },
  { category: "AC & Heating", name: "R134a/R1234yf AC Gas Recharge & Leak Detection", baseAmount: 210, duration: 60, priority: "MEDIUM" },
  { category: "AC & Heating", name: "Cabin Blower Motor & Evaporator Cleanse", baseAmount: 180, duration: 45, priority: "LOW" }
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPlate() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 3; i++) str += letters[Math.floor(Math.random() * letters.length)];
  str += "-" + Math.floor(1000 + Math.random() * 9000);
  return str;
}

async function main() {
  console.log("🧹 Clearing old database records...");
  await prisma.statusHistory.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.mechanic.deleteMany({});

  console.log("🛠️ Seeding Mechanics (25)...");
  const createdMechanics = [];
  for (let i = 0; i < MECHANIC_DATA.length; i++) {
    const m = MECHANIC_DATA[i];
    const initialStatus = i < 8 ? "AVAILABLE" : i < 16 ? "EN_ROUTE" : i < 22 ? "BUSY" : "OFFLINE";
    const mechanic = await prisma.mechanic.create({
      data: {
        name: m.name,
        email: `${m.name.toLowerCase().replace(/\s+/g, ".") + i}@instantmechanic.internal`,
        phone: `+1 (415) 555-${String(1000 + i).slice(-4)}`,
        rating: m.rating,
        specialization: m.spec,
        latitude: m.lat + (Math.random() - 0.5) * 0.02,
        longitude: m.lng + (Math.random() - 0.5) * 0.02,
        status: initialStatus,
        jobsCompleted: randomBetween(24, 180),
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + i}?auto=format&fit=crop&w=150&q=80`
      }
    });
    createdMechanics.push(mechanic);
  }

  console.log("👥 Seeding Customers & Vehicles (65)...");
  const createdCustomers = [];
  const createdVehicles = [];

  for (let i = 0; i < CUSTOMER_NAMES.length; i++) {
    const name = CUSTOMER_NAMES[i];
    const cust = await prisma.customer.create({
      data: {
        name: name,
        email: `${name.toLowerCase().replace(/['\s]+/g, ".")}@example.com`,
        phone: `+1 (415) 800-${String(2000 + i).slice(-4)}`,
        address: `${randomBetween(100, 999)} ${randomChoice(["Market St", "Mission St", "Geary Blvd", "Valencia St", "Folsom St", "Montgomery St", "Van Ness Ave", "Divisadero St", "Columbus Ave", "Lombard St"])}, San Francisco, CA`,
        city: "San Francisco",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      }
    });
    createdCustomers.push(cust);

    // Create 1-2 vehicles per customer
    const carChoice = randomChoice(CAR_MODELS);
    const vehicle = await prisma.vehicle.create({
      data: {
        make: carChoice.make,
        model: carChoice.model,
        year: randomBetween(2015, 2024),
        licensePlate: randomPlate(),
        customerId: cust.id
      }
    });
    createdVehicles.push(vehicle);
  }

  console.log("🚗 Seeding 560+ Bookings with Full Timeline History...");
  const statuses = ["COMPLETED", "IN_PROGRESS", "EN_ROUTE", "ASSIGNED", "PENDING", "CANCELLED"];
  const now = new Date();
  let bookingSequence = 84000;

  for (let i = 0; i < 560; i++) {
    bookingSequence++;
    const bookingId = `IM-${bookingSequence}`;
    const customer = randomChoice(createdCustomers);
    const customerVehicles = createdVehicles.filter(v => v.customerId === customer.id);
    const vehicle = customerVehicles.length > 0 ? customerVehicles[0] : randomChoice(createdVehicles);
    const service = randomChoice(SERVICES);
    const mechanic = Math.random() > 0.15 ? randomChoice(createdMechanics) : null;

    // Distribute timestamps:
    // Past 45 days (80%), Today (15%), Tomorrow/Future (5%)
    let scheduledDate;
    let status;

    if (i < 430) {
      // Historical past bookings
      const daysAgo = randomBetween(1, 45);
      const hoursAgo = randomBetween(8, 19);
      scheduledDate = new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 3600 * 1000);
      status = Math.random() > 0.08 ? "COMPLETED" : "CANCELLED";
    } else if (i < 530) {
      // Today's live active queue
      const hourToday = randomBetween(7, 21);
      const minToday = randomBetween(0, 59);
      scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourToday, minToday);
      
      const r = Math.random();
      if (r < 0.25) status = "PENDING";
      else if (r < 0.50) status = "ASSIGNED";
      else if (r < 0.72) status = "EN_ROUTE";
      else if (r < 0.90) status = "IN_PROGRESS";
      else status = "COMPLETED";
    } else {
      // Upcoming future bookings
      const daysAhead = randomBetween(1, 4);
      scheduledDate = new Date(now.getTime() + (daysAhead * 24 + randomBetween(9, 17)) * 3600 * 1000);
      status = Math.random() > 0.5 ? "PENDING" : "ASSIGNED";
    }

    const priceVariation = (randomBetween(90, 115) / 100);
    const finalAmount = Math.round(service.baseAmount * priceVariation);

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerId: customer.id,
        vehicleId: vehicle ? vehicle.id : null,
        mechanicId: status !== "PENDING" && mechanic ? mechanic.id : null,
        serviceCategory: service.category,
        serviceName: service.name,
        status: status,
        priority: service.priority,
        amount: finalAmount,
        estimatedDuration: service.duration,
        notes: `Customer requested mobile on-site service at ${customer.address}. Key under mat if away.`,
        customerAddress: customer.address,
        customerLat: 37.7749 + (Math.random() - 0.5) * 0.06,
        customerLng: -122.4194 + (Math.random() - 0.5) * 0.06,
        scheduledAt: scheduledDate,
        createdAt: new Date(scheduledDate.getTime() - randomBetween(2, 48) * 3600 * 1000),
        startedAt: ["EN_ROUTE", "IN_PROGRESS", "COMPLETED"].includes(status) ? scheduledDate : null,
        completedAt: status === "COMPLETED" ? new Date(scheduledDate.getTime() + service.duration * 60000) : null
      }
    });

    // Create status history timeline
    const timeline = [];
    timeline.push({
      bookingId: booking.id,
      status: "PENDING",
      timestamp: booking.createdAt,
      note: "Booking submitted by customer via mobile app."
    });

    if (["ASSIGNED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      timeline.push({
        bookingId: booking.id,
        status: "ASSIGNED",
        timestamp: new Date(booking.createdAt.getTime() + 15 * 60000),
        note: mechanic ? `Assigned to lead specialist ${mechanic.name}.` : "Assigned to regional dispatch."
      });
    }

    if (["EN_ROUTE", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      timeline.push({
        bookingId: booking.id,
        status: "EN_ROUTE",
        timestamp: new Date(scheduledDate.getTime() - 25 * 60000),
        note: "Mechanic is on the way with mobile workshop van."
      });
    }

    if (["IN_PROGRESS", "COMPLETED"].includes(status)) {
      timeline.push({
        bookingId: booking.id,
        status: "IN_PROGRESS",
        timestamp: scheduledDate,
        note: "Vehicle inspection and service underway."
      });
    }

    if (status === "COMPLETED") {
      timeline.push({
        bookingId: booking.id,
        status: "COMPLETED",
        timestamp: new Date(scheduledDate.getTime() + service.duration * 60000),
        note: "Job successfully completed. 25-point safety inspection passed."
      });
    } else if (status === "CANCELLED") {
      timeline.push({
        bookingId: booking.id,
        status: "CANCELLED",
        timestamp: new Date(booking.createdAt.getTime() + 30 * 60000),
        note: "Customer rescheduled or cancelled prior to technician dispatch."
      });
    }

    for (const t of timeline) {
      await prisma.statusHistory.create({ data: t });
    }
  }

  console.log("✅ Seed completed successfully! Over 560 bookings, 65 customers, 25 mechanics ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
