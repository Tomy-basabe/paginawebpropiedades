import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjxywapawhtcrdenslma.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeHl3YXBhd2h0Y3JkZW5zbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjkxMzIsImV4cCI6MjEwNjE0NTEzMn0.zsAjbOkIGUA4i7EPgS_cuABoHGRMsqSbHh-jts5ce1Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log("Conectando con Supabase...");

  const testId = "prop-test-" + Date.now();
  const testPropertyData = {
    id: testId,
    title: "Penthouse de Prueba - Torre Bellini",
    slug: "penthouse-de-prueba-torre-bellini",
    operation: "venta",
    type: "departamento",
    status: "disponible",
    price: 380000,
    currency: "USD",
    location: {
      city: "CABA",
      neighborhood: "Palermo Soho",
      address: "Honduras al 5500",
      zone: "Capital Federal",
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 2,
      totalArea: 145,
      coveredArea: 120,
      yearBuilt: 2023,
      expenses: 250,
    },
    amenities: ["Seguridad 24hs", "Piscina", "SUM", "Gimnasio"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    hasVideoTour: true,
    highlightSummary: "Piso alto con vistas panorámicas y tour audiovisual.",
    description: "Propiedad de prueba cargada para verificar la vinculación exitosa con Supabase.",
    isFeatured: true,
    isOpportunity: true,
    opportunityBadge: "Oportunidad Exclusiva",
    createdAt: new Date().toISOString().split("T")[0],
  };

  // 1. Insertar propiedad en Supabase exactamente como lo hace la app
  const { data: insertData, error: insertError } = await supabase
    .from("properties")
    .upsert({
      id: testId,
      title: testPropertyData.title,
      operation: testPropertyData.operation,
      type: testPropertyData.type,
      status: testPropertyData.status,
      price: testPropertyData.price,
      currency: testPropertyData.currency,
      location: testPropertyData.location,
      features: testPropertyData.features,
      images: testPropertyData.images,
      description: testPropertyData.description,
      is_featured: testPropertyData.isFeatured,
      is_opportunity: testPropertyData.isOpportunity,
      data: testPropertyData,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (insertError) {
    console.error("❌ Error al insertar propiedad:", insertError);
    return;
  }
  console.log("✅ Propiedad de prueba insertada con éxito:", insertData[0].title);

  // 2. Insertar también un banner de prueba
  const bannerId = "banner-test-" + Date.now();
  const testBanner = {
    id: bannerId,
    title: "Gran Oportunidad en Preventa",
    subtitle: "Desarrollo Exclusivo Puerto Madero",
    badge: "Lanzamiento 2026",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    link: "/propiedades",
    cta_text: "Ver Unidades",
    is_active: true,
    data: {
      id: bannerId,
      title: "Gran Oportunidad en Preventa",
      subtitle: "Desarrollo Exclusivo Puerto Madero",
      badge: "Lanzamiento 2026",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      ctaLink: "/propiedades",
      ctaText: "Ver Unidades",
      active: true,
    },
  };

  const { error: bannerError } = await supabase.from("featured_banners").upsert(testBanner);
  if (bannerError) {
    console.error("❌ Error al insertar banner:", bannerError);
  } else {
    console.log("✅ Banner de prueba insertado con éxito.");
  }

  // 3. Consultar la base de datos para verificar que todo se lee en vivo
  const { data: readProps, error: readError } = await supabase
    .from("properties")
    .select("id, title, price, status, is_featured")
    .order("created_at", { ascending: false })
    .limit(5);

  if (readError) {
    console.error("❌ Error al leer propiedades:", readError);
    return;
  }

  console.log("\n📋 Propiedades registradas actualmente en tu Supabase:");
  console.table(readProps);
}

runTest();
