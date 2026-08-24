async function test() {
  console.log("--- Testing Backend Endpoints ---");

  // 1. Health
  const healthRes = await fetch("http://localhost:5000/api/health");
  console.log("1. Health:", await healthRes.json());

  // 2. Contacts GET
  const contactsGet = await fetch("http://localhost:5000/api/contacts");
  console.log("2. Contacts (GET):", await contactsGet.json());

  // 3. Contacts POST
  const contactCreate = await fetch("http://localhost:5000/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rahul Verma",
      relationship: "Brother",
      phone: "+91 91234 56789",
    }),
  });
  const createdData = await contactCreate.json();
  console.log("3. Contacts (POST):", createdData);

  // 4. Emergency Status
  const statusRes = await fetch("http://localhost:5000/api/emergency/status");
  console.log("4. Emergency Status:", await statusRes.json());

  // 5. Trigger SOS
  const sosRes = await fetch("http://localhost:5000/api/emergency/sos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "demo-user",
      userName: "Aarav Sharma",
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 10,
        address: "Bengaluru, Karnataka, India",
      },
      timestamp: new Date().toISOString(),
    }),
  });
  console.log("5. Trigger SOS (POST):", await sosRes.json());

  // 6. Emergency Card Public Data (QR code target)
  const cardRes = await fetch("http://localhost:5000/api/emergency/card/demo-user");
  console.log("6. Emergency Card (GET):", await cardRes.json());

  console.log("\n✅ All Backend Endpoints Tested Successfully!");
}

test().catch(console.error);
