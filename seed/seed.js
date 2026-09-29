const dbName = "printing_house";
db = db.getSiblingDB(dbName);

print("Brisanje postojece baze '" + dbName + "'...");
db.dropDatabase();

const now = new Date();

const PW = {
  admin: "$2a$10$8vRWsXOxRDdJLYO1/EUc8OybFvVnTAMLJghYNbQTBP0WcCphMwX92",
  stampar1: "$2a$10$AYR0TvKKQRSEsFHvmuaiLeLtG7Tziwob1f/0ZEyGXSeSsWBHq2cVW",
  stampar2: "$2a$10$tWniq5EGLaU1mbcAzwWrBOUTKhJsoBlX8Udi9c9PANZsCkptesqbi",
  stampar3: "$2a$10$rTAvjtERGdy7sUl7GHhGhu4viUkwiyBaFt3O.QPEYydPo/gHWR33.",
  klijent1: "$2a$10$VVCDnXYKLHYuZAQcK9Qn0uFkQ6Xi1YwsBS7uETigxUz.Gugqtrmli",
  klijent2: "$2a$10$l662St2XGwRvpKy68l1MWuHoKPxA6zQX0OO2Ccxet6omOkE34joQW",
  firma1: "$2a$10$eFqMuRFYNtPxDavlGhaz3OM4NmOTNnGM/JQPXgOO0Wv/SmM6rV8GS"
};

print("Ubacivanje kategorija...");
db.categories.insertMany([
  {
    name: "Štampa malih formata",
    subcategories: [
      { _id: new ObjectId(), name: "Olovke" },
      { _id: new ObjectId(), name: "Vizit karte" },
      { _id: new ObjectId(), name: "Flajeri" },
      { _id: new ObjectId(), name: "Zahvalnice" },
      { _id: new ObjectId(), name: "Pozivnice" },
      { _id: new ObjectId(), name: "Fascikle" }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    name: "Štampa velikih formata",
    subcategories: [
      { _id: new ObjectId(), name: "Posteri" },
      { _id: new ObjectId(), name: "Rollups" },
      { _id: new ObjectId(), name: "Fototapete" }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    name: "Kreativne štampe",
    subcategories: [
      { _id: new ObjectId(), name: "Šolje" },
      { _id: new ObjectId(), name: "Štampa na majicama" },
      { _id: new ObjectId(), name: "Štampa na duksevima" },
      { _id: new ObjectId(), name: "Štampa na cegerima" }
    ],
    createdAt: now,
    updatedAt: now
  }
]);

print("Ubacivanje korisnika...");

const adminId = db.users.insertOne({
  username: "admin",
  passwordHash: PW.admin,
  email: "admin@printinghouse.local",
  firstName: "Admin",
  lastName: "Administrator",
  phone: "0600000000",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "admin",
  createdAt: now,
  updatedAt: now
}).insertedId;

const printer1Id = db.users.insertOne({
  username: "stampar1",
  passwordHash: PW.stampar1,
  email: "kontakt@copystudio.rs",
  firstName: "Nikola",
  lastName: "Ilić",
  phone: "0641112233",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "printer",
  companyName: "Copy Studio Kumanovska",
  address: "Kumanovska 4",
  city: "Beograd",
  registrationNumber: "20123456",
  pib: "108123456",
  createdAt: now,
  updatedAt: now
}).insertedId;

const printer2Id = db.users.insertOne({
  username: "stampar2",
  passwordHash: PW.stampar2,
  email: "kontakt@printmax.rs",
  firstName: "Jovana",
  lastName: "Radić",
  phone: "0642223344",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "printer",
  companyName: "PrintMax Novi Sad",
  address: "Bulevar oslobođenja 10",
  city: "Novi Sad",
  registrationNumber: "20234567",
  pib: "108234567",
  createdAt: now,
  updatedAt: now
}).insertedId;

const printer3Id = db.users.insertOne({
  username: "stampar3",
  passwordHash: PW.stampar3,
  email: "kontakt@grafikaplus.rs",
  firstName: "Miloš",
  lastName: "Stanković",
  phone: "0643334455",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "printer",
  companyName: "Grafika Plus",
  address: "Obilićev venac 2",
  city: "Niš",
  registrationNumber: "20345678",
  pib: "108345678",
  createdAt: now,
  updatedAt: now
}).insertedId;

const client1Id = db.users.insertOne({
  username: "klijent1",
  passwordHash: PW.klijent1,
  email: "marko.petrovic@example.com",
  firstName: "Marko",
  lastName: "Petrović",
  phone: "0651234567",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "client",
  isCompany: false,
  createdAt: now,
  updatedAt: now
}).insertedId;

const client2Id = db.users.insertOne({
  username: "klijent2",
  passwordHash: PW.klijent2,
  email: "ana.jovanovic@example.com",
  firstName: "Ana",
  lastName: "Jovanović",
  phone: "0652345678",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "client",
  isCompany: false,
  createdAt: now,
  updatedAt: now
}).insertedId;

const firma1Id = db.users.insertOne({
  username: "firma1",
  passwordHash: PW.firma1,
  email: "nabavka@fondacija-primer.rs",
  firstName: "Petar",
  lastName: "Nikolić",
  phone: "0653456789",
  profileImage: "default_profile_image.jpg",
  status: "approved",
  role: "client",
  isCompany: true,
  companyName: "Fondacija Primer",
  address: "Knez Mihailova 5",
  city: "Beograd",
  registrationNumber: "17456789",
  pib: "104456789",
  createdAt: now,
  updatedAt: now
}).insertedId;

db.users.insertOne({
  username: "novaregistracija",
  passwordHash: PW.klijent1,
  email: "nova.registracija@example.com",
  firstName: "Jelena",
  lastName: "Simić",
  phone: "0654567890",
  profileImage: "default_profile_image.jpg",
  status: "pending",
  role: "client",
  isCompany: false,
  createdAt: now,
  updatedAt: now
});
db.users.insertOne({
  username: "novastamparija",
  passwordHash: PW.stampar1,
  email: "nova.stamparija@example.com",
  firstName: "Dušan",
  lastName: "Popović",
  phone: "0655678901",
  profileImage: "default_profile_image.jpg",
  status: "pending",
  role: "printer",
  companyName: "Nova Štamparija DOO",
  address: "Cara Dušana 1",
  city: "Kragujevac",
  registrationNumber: "20456789",
  pib: "108456789",
  createdAt: now,
  updatedAt: now
});

print("Ubacivanje proizvoda...");

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

const p1 = db.products.insertOne({
  printerId: printer1Id,
  sifra: "PR-001",
  naziv: "Pamučna Polo Majica",
  opis: "Kvalitetna pamučna polo majica 180g/m2, pogodna za brendiranje i korporativne uniforme.",
  kategorija: "Kreativne štampe",
  potkategorija: "Štampa na majicama",
  jedinicnaCena: 1200,
  kolicinaNaLageru: 150,
  dostupneBoje: ["Bela", "Crna", "Tamno plava", "Siva"],
  slikaUrl: "product-polo-majica.jpg",
  dodatneSlike: ["gal-polo-majica-1.jpg", "gal-polo-majica-2.jpg", "gal-polo-majica-3.jpg"],
  uslugeStampe: [
    { idUsluge: "USL-01", tipStampe: "Direktna štampa na tekstil (DTG)", dodatnaCenaPoKomadu: 350, maxSirinaMm: 300, maxVisinaMm: 400 },
    { idUsluge: "USL-02", tipStampe: "Preslikač (Sito preslikač)", dodatnaCenaPoKomadu: 200, maxSirinaMm: 280, maxVisinaMm: 350 }
  ],
  likes: [
    { userId: client1Id, createdAt: daysAgo(20) },
    { userId: client2Id, createdAt: daysAgo(5) }
  ],
  dislikes: [],
  createdAt: daysAgo(40),
  updatedAt: daysAgo(5)
}).insertedId;

const p2 = db.products.insertOne({
  printerId: printer1Id,
  sifra: "PR-002",
  naziv: "Keramička šolja 330ml",
  opis: "Bela keramička šolja visokog sjaja, idealna za sublimacionu štampu visoke rezolucije.",
  kategorija: "Kreativne štampe",
  potkategorija: "Šolje",
  jedinicnaCena: 320,
  kolicinaNaLageru: 500,
  dostupneBoje: ["Bela"],
  slikaUrl: "product-solja.jpg",
  dodatneSlike: ["gal-solja-1.jpg"],
  uslugeStampe: [{ idUsluge: "USL-03", tipStampe: "Sublimaciona štampa", dodatnaCenaPoKomadu: 150, maxSirinaMm: 200, maxVisinaMm: 85 }],
  likes: [{ userId: client1Id, createdAt: daysAgo(15) }],
  dislikes: [{ userId: client2Id, createdAt: daysAgo(10) }],
  createdAt: daysAgo(35),
  updatedAt: daysAgo(10)
}).insertedId;

const p3 = db.products.insertOne({
  printerId: printer1Id,
  sifra: "PR-003",
  naziv: "Vizit karta 300g mat",
  opis: "Premium vizit karta sa mat laminacijom, štampa u punom koloru sa obe strane.",
  kategorija: "Štampa malih formata",
  potkategorija: "Vizit karte",
  jedinicnaCena: 10,
  kolicinaNaLageru: 5000,
  dostupneBoje: ["Bela"],
  slikaUrl: "product-vizitkarta.jpg",
  dodatneSlike: ["gal-vizitkarta-1.jpg", "gal-vizitkarta-2.jpg"],
  uslugeStampe: [{ idUsluge: "USL-04", tipStampe: "Digitalna štampa", dodatnaCenaPoKomadu: 3, maxSirinaMm: 90, maxVisinaMm: 55 }],
  likes: [],
  dislikes: [],
  createdAt: daysAgo(30),
  updatedAt: daysAgo(30)
}).insertedId;

const p4 = db.products.insertOne({
  printerId: printer2Id,
  sifra: "PM-101",
  naziv: "Promotivni Roll-up Baner 85x200cm",
  opis: "Lagan aluminijumski mehanizam sa torbom i štampom na kvalitetnom baner platnu.",
  kategorija: "Štampa velikih formata",
  potkategorija: "Rollups",
  jedinicnaCena: 4500,
  kolicinaNaLageru: 25,
  dostupneBoje: ["Bela", "Crna"],
  slikaUrl: "product-rollup.jpg",
  dodatneSlike: ["gal-rollup-1.jpg", "gal-rollup-2.jpg"],
  uslugeStampe: [{ idUsluge: "USL-05", tipStampe: "Eko-solventna štampa visoke rezolucije", dodatnaCenaPoKomadu: 800, maxSirinaMm: 850, maxVisinaMm: 2000 }],
  likes: [{ userId: client2Id, createdAt: daysAgo(3) }],
  dislikes: [],
  createdAt: daysAgo(25),
  updatedAt: daysAgo(3)
}).insertedId;

const p5 = db.products.insertOne({
  printerId: printer2Id,
  sifra: "PM-102",
  naziv: "Flajer A5 sjajni",
  opis: "Flajer A5 formata, sjajna kunstdruk hartija 150g, dvostrana štampa.",
  kategorija: "Štampa malih formata",
  potkategorija: "Flajeri",
  jedinicnaCena: 8,
  kolicinaNaLageru: 3000,
  dostupneBoje: ["Bela"],
  slikaUrl: "product-flajer.jpg",
  dodatneSlike: ["gal-flajer-1.jpg"],
  uslugeStampe: [],
  likes: [],
  dislikes: [],
  createdAt: daysAgo(20),
  updatedAt: daysAgo(20)
}).insertedId;

const p6 = db.products.insertOne({
  printerId: printer3Id,
  sifra: "GP-201",
  naziv: "Duks sa kapuljačom",
  opis: "Pamučno-poliesterski duks, 320g/m2, pogodan za vez i štampu.",
  kategorija: "Kreativne štampe",
  potkategorija: "Štampa na duksevima",
  jedinicnaCena: 2400,
  kolicinaNaLageru: 80,
  dostupneBoje: ["Crna", "Siva", "Bordo"],
  slikaUrl: "product-duks.jpg",
  dodatneSlike: ["gal-duks-1.jpg", "gal-duks-2.jpg", "gal-duks-3.jpg"],
  uslugeStampe: [{ idUsluge: "USL-06", tipStampe: "Preslikač (Sito preslikač)", dodatnaCenaPoKomadu: 400, maxSirinaMm: 300, maxVisinaMm: 400 }],
  likes: [{ userId: client1Id, createdAt: daysAgo(2) }],
  dislikes: [],
  createdAt: daysAgo(18),
  updatedAt: daysAgo(2)
}).insertedId;

const p7 = db.products.insertOne({
  printerId: printer3Id,
  sifra: "GP-202",
  naziv: "Poster A2 fotografski",
  opis: "Fotografski poster A2 formata, 200g/m2 sjajna hartija.",
  kategorija: "Štampa velikih formata",
  potkategorija: "Posteri",
  jedinicnaCena: 650,
  kolicinaNaLageru: 60,
  dostupneBoje: ["Bela"],
  slikaUrl: "product-poster.jpg",
  dodatneSlike: ["gal-poster-1.jpg"],
  uslugeStampe: [],
  likes: [],
  dislikes: [],
  createdAt: daysAgo(15),
  updatedAt: daysAgo(15)
}).insertedId;

print("Ubacivanje komentara...");
db.comments.insertMany([
  { productId: p1, userId: client1Id, username: "klijent1", text: "Odličan kvalitet materijala, preporučujem!", createdAt: daysAgo(20), updatedAt: daysAgo(20) },
  { productId: p1, userId: client2Id, username: "klijent2", text: "Brza isporuka, štampa lepo drži boju.", createdAt: daysAgo(5), updatedAt: daysAgo(5) },
  { productId: p2, userId: client1Id, username: "klijent1", text: "Šolja stigla neoštećena, štampa oštra.", createdAt: daysAgo(15), updatedAt: daysAgo(15) }
]);

print("Ubacivanje narudžbina...");

db.orders.insertOne({
  clientId: client1Id,
  printerId: printer1Id,
  nazivStamparije: "Copy Studio Kumanovska",
  grad: "Beograd",
  items: [
    {
      productId: p1,
      naziv: "Pamučna Polo Majica",
      kolicina: 2,
      boja: "Crna",
      usluge: [{ idUsluge: "USL-01", tipStampe: "Direktna štampa na tekstil (DTG)", dodatnaCenaPoKomadu: 350 }],
      customization: { type: "text", value: "Tim Alfa" },
      cenaPoKomadu: 1550,
      ukupno: 3100
    }
  ],
  ukupanIznos: 3100,
  status: "primljeno",
  procurementId: null,
  createdAt: daysAgo(20),
  updatedAt: daysAgo(18)
});

db.orders.insertOne({
  clientId: client2Id,
  printerId: printer1Id,
  nazivStamparije: "Copy Studio Kumanovska",
  grad: "Beograd",
  items: [
    { productId: p2, naziv: "Keramička šolja 330ml", kolicina: 5, boja: "Bela", usluge: [], customization: { type: null, value: null }, cenaPoKomadu: 320, ukupno: 1600 }
  ],
  ukupanIznos: 1600,
  status: "isporuceno",
  procurementId: null,
  createdAt: daysAgo(10),
  updatedAt: daysAgo(8)
});

db.orders.insertOne({
  clientId: client1Id,
  printerId: printer2Id,
  nazivStamparije: "PrintMax Novi Sad",
  grad: "Novi Sad",
  items: [
    { productId: p4, naziv: "Promotivni Roll-up Baner 85x200cm", kolicina: 1, boja: "Bela", usluge: [], customization: { type: null, value: null }, cenaPoKomadu: 4500, ukupno: 4500 }
  ],
  ukupanIznos: 4500,
  status: "u_stampi",
  procurementId: null,
  createdAt: daysAgo(4),
  updatedAt: daysAgo(3)
});

db.orders.insertOne({
  clientId: client2Id,
  printerId: printer3Id,
  nazivStamparije: "Grafika Plus",
  grad: "Niš",
  items: [
    { productId: p6, naziv: "Duks sa kapuljačom", kolicina: 3, boja: "Siva", usluge: [], customization: { type: null, value: null }, cenaPoKomadu: 2400, ukupno: 7200 }
  ],
  ukupanIznos: 7200,
  status: "naruceno",
  procurementId: null,
  createdAt: daysAgo(1),
  updatedAt: daysAgo(1)
});

print("Ubacivanje primera javne nabavke...");

const closedOrderId = db.orders.insertOne({
  clientId: firma1Id,
  printerId: printer1Id,
  nazivStamparije: "Copy Studio Kumanovska",
  grad: "Beograd",
  items: [{ productId: p3, naziv: "Vizit karta 300g mat", kolicina: 500, boja: null, usluge: [], customization: { type: null, value: null }, cenaPoKomadu: 9, ukupno: 4500 }],
  ukupanIznos: 4500,
  status: "u_stampi",
  procurementId: null,
  createdAt: daysAgo(7),
  updatedAt: daysAgo(7)
}).insertedId;

db.procurements.insertOne({
  clientId: firma1Id,
  items: [{ naziv: "Vizit karta 300g mat", kategorija: "Štampa malih formata", kolicina: 500 }],
  deadline: daysAgo(7),
  status: "closed",
  bids: [
    {
      printerId: printer1Id,
      items: [{ naziv: "Vizit karta 300g mat", productId: p3, cenaPoKomadu: 9, kolicinaDostupna: 5000 }],
      ukupnaCena: 4500,
      submittedAt: daysAgo(7)
    },
    {
      printerId: printer2Id,
      items: [{ naziv: "Vizit karta 300g mat", productId: p5, cenaPoKomadu: 11, kolicinaDostupna: 3000 }],
      ukupnaCena: 5500,
      submittedAt: daysAgo(7)
    }
  ],
  winningPrinterId: printer1Id,
  resultingOrderId: closedOrderId,
  createdAt: daysAgo(7),
  updatedAt: daysAgo(7)
});

print("");
print("=== Seed završen ===");
print("Admin:      admin / Admin123!");
print("Štamparije: stampar1 / Stampar1!x  (Copy Studio Kumanovska, Beograd)");
print("            stampar2 / Stampar2!x  (PrintMax Novi Sad)");
print("            stampar3 / Stampar3!x  (Grafika Plus, Niš)");
print("Klijenti:   klijent1 / Klijent1!x  (fizičko lice)");
print("            klijent2 / Klijent2!x  (fizičko lice)");
print("            firma1   / Firma123!x  (pravno lice - Fondacija Primer)");
print("Na cekanju: novaregistracija (klijent), novastamparija (stampar) - za demo odobravanja");
