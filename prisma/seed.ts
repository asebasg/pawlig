import { PrismaClient, UserRole, Municipality, PetStatus, AdoptionStatus, OrderStatus, AuditAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PLACEHOLDER_PET_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg";
const PLACEHOLDER_PRODUCT_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg";
const PLACEHOLDER_LOGO = "https://res.cloudinary.com/demo/image/upload/v1/samples/logo.png";

async function main() {
    console.log("🌱 Iniciando seeder de PawLig...");

    // ─────────────────────────────────────────────
    // Limpiar base de datos (orden inverso de dependencias)
    // ─────────────────────────────────────────────
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.adoption.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.product.deleteMany();
    await prisma.shelter.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.userAudit.deleteMany();
    await prisma.user.deleteMany();
    console.log("🗑️  Base de datos limpiada.");

    const password = await bcrypt.hash("Password123!", 10);

    // ─────────────────────────────────────────────
    // 1. USUARIOS
    // ─────────────────────────────────────────────

    // Admin
    const admin = await prisma.user.create({
        data: {
            email: "admin@pawlig.com",
            password,
            name: "Administrador PawLig",
            role: UserRole.ADMIN,
            phone: "3001234567",
            municipality: Municipality.MEDELLIN,
            address: "Calle 10 # 43-12, El Poblado",
            idNumber: "1000000001",
            birthDate: new Date("1985-03-15"),
        },
    });

    // Usuarios SHELTER (cuentas de albergue)
    const shelterUser1 = await prisma.user.create({
        data: {
            email: "refugio.huellitas@pawlig.com",
            password,
            name: "Carlos Mendoza",
            role: UserRole.SHELTER,
            phone: "3012345678",
            municipality: Municipality.MEDELLIN,
            address: "Carrera 65 # 34-20, Laureles",
            idNumber: "1000000002",
            birthDate: new Date("1978-07-22"),
        },
    });

    const shelterUser2 = await prisma.user.create({
        data: {
            email: "amigos.peludos@pawlig.com",
            password,
            name: "Laura Ríos",
            role: UserRole.SHELTER,
            phone: "3023456789",
            municipality: Municipality.BELLO,
            address: "Calle 52 # 90-15, Bello Centro",
            idNumber: "1000000003",
            birthDate: new Date("1990-11-05"),
        },
    });

    const shelterUser3 = await prisma.user.create({
        data: {
            email: "patitas.felices@pawlig.com",
            password,
            name: "Andrés Zapata",
            role: UserRole.SHELTER,
            phone: "3034567890",
            municipality: Municipality.ENVIGADO,
            address: "Avenida El Poblado # 12-34",
            idNumber: "1000000004",
            birthDate: new Date("1982-04-18"),
        },
    });

    const shelterUser4 = await prisma.user.create({
        data: {
            email: "refugio.vida@pawlig.com",
            password,
            name: "María Gómez",
            role: UserRole.SHELTER,
            phone: "3045678901",
            municipality: Municipality.ITAGUI,
            address: "Calle 85 # 43-67, Ditaires",
            idNumber: "1000000005",
            birthDate: new Date("1975-09-30"),
        },
    });

    // Sin verificar (para probar flujo de aprobación)
    const shelterUserPending = await prisma.user.create({
        data: {
            email: "nuevo.refugio@pawlig.com",
            password,
            name: "Pedro Salazar",
            role: UserRole.SHELTER,
            phone: "3056789012",
            municipality: Municipality.SABANETA,
            address: "Carrera 43A # 10-20",
            idNumber: "1000000006",
            birthDate: new Date("1995-01-12"),
        },
    });

    // Usuarios VENDOR
    const vendorUser1 = await prisma.user.create({
        data: {
            email: "mascotas.felices@pawlig.com",
            password,
            name: "Juliana Torres",
            role: UserRole.VENDOR,
            phone: "3067890123",
            municipality: Municipality.MEDELLIN,
            address: "Calle 10 # 32-45, Astorga",
            idNumber: "1000000007",
            birthDate: new Date("1988-06-25"),
        },
    });

    const vendorUser2 = await prisma.user.create({
        data: {
            email: "petshop.valle@pawlig.com",
            password,
            name: "Diego Herrera",
            role: UserRole.VENDOR,
            phone: "3078901234",
            municipality: Municipality.ENVIGADO,
            address: "Carrera 25 # 35-12, Envigado Centro",
            idNumber: "1000000008",
            birthDate: new Date("1992-02-14"),
        },
    });

    const vendorUserPending = await prisma.user.create({
        data: {
            email: "nuevo.vendor@pawlig.com",
            password,
            name: "Camila Restrepo",
            role: UserRole.VENDOR,
            phone: "3089012345",
            municipality: Municipality.COPACABANA,
            address: "Calle 20 # 15-30, Copacabana Centro",
            idNumber: "1000000009",
            birthDate: new Date("1997-08-08"),
        },
    });

    // Usuarios ADOPTER
    const adopters = await Promise.all([
        prisma.user.create({
            data: {
                email: "sofia.martinez@gmail.com",
                password,
                name: "Sofía Martínez",
                role: UserRole.ADOPTER,
                phone: "3090123456",
                municipality: Municipality.MEDELLIN,
                address: "Calle 5 # 43D-12, El Poblado",
                idNumber: "1000000010",
                birthDate: new Date("1993-12-01"),
            },
        }),
        prisma.user.create({
            data: {
                email: "juan.perez@gmail.com",
                password,
                name: "Juan Pérez",
                role: UserRole.ADOPTER,
                phone: "3101234567",
                municipality: Municipality.BELLO,
                address: "Calle 50 # 45-23, Bello",
                idNumber: "1000000011",
                birthDate: new Date("1987-03-20"),
            },
        }),
        prisma.user.create({
            data: {
                email: "valentina.lopez@gmail.com",
                password,
                name: "Valentina López",
                role: UserRole.ADOPTER,
                phone: "3112345678",
                municipality: Municipality.SABANETA,
                address: "Carrera 43 # 60-10, Sabaneta",
                idNumber: "1000000012",
                birthDate: new Date("1999-07-15"),
            },
        }),
        prisma.user.create({
            data: {
                email: "miguel.castano@gmail.com",
                password,
                name: "Miguel Castaño",
                role: UserRole.ADOPTER,
                phone: "3123456789",
                municipality: Municipality.ITAGUI,
                address: "Calle 77 # 50-30, Itagüí",
                idNumber: "1000000013",
                birthDate: new Date("1980-05-10"),
            },
        }),
        prisma.user.create({
            data: {
                email: "ana.villa@gmail.com",
                password,
                name: "Ana Villa",
                role: UserRole.ADOPTER,
                phone: "3134567890",
                municipality: Municipality.ENVIGADO,
                address: "Avenida Las Vegas # 5-67",
                idNumber: "1000000014",
                birthDate: new Date("2000-11-28"),
            },
        }),
        prisma.user.create({
            data: {
                email: "nicolas.arango@gmail.com",
                password,
                name: "Nicolás Arango",
                role: UserRole.ADOPTER,
                phone: "3145678901",
                municipality: Municipality.MEDELLIN,
                address: "Circular 73 # 39-45, Laureles",
                idNumber: "1000000015",
                birthDate: new Date("1995-09-03"),
            },
        }),
        // Usuario bloqueado (para probar flujo admin)
        prisma.user.create({
            data: {
                email: "bloqueado@gmail.com",
                password,
                name: "Usuario Bloqueado",
                role: UserRole.ADOPTER,
                phone: "3156789012",
                municipality: Municipality.CALDAS,
                address: "Calle 1 # 1-1, Caldas",
                idNumber: "1000000016",
                birthDate: new Date("1990-01-01"),
                isActive: false,
                blockedAt: new Date(),
                blockReason: "Comportamiento inapropiado en la plataforma.",
            },
        }),
    ]);

    console.log("✅ Usuarios creados.");

    // ─────────────────────────────────────────────
    // 2. ALBERGUES
    // ─────────────────────────────────────────────
    const shelter1 = await prisma.shelter.create({
        data: {
            name: "Refugio Huellitas de Amor",
            nit: "900123456-1",
            municipality: Municipality.MEDELLIN,
            address: "Carrera 65 # 34-20, Laureles",
            description: "Somos un refugio sin ánimo de lucro dedicado al rescate y rehabilitación de animales abandonados en Medellín. Llevamos más de 10 años salvando vidas peludas.",
            verified: true,
            contactWhatsApp: "+573012345678",
            contactInstagram: "@huellitas_amor",
            userId: shelterUser1.id,
        },
    });

    const shelter2 = await prisma.shelter.create({
        data: {
            name: "Amigos Peludos Bello",
            nit: "900234567-2",
            municipality: Municipality.BELLO,
            address: "Calle 52 # 90-15, Bello Centro",
            description: "Fundación enfocada en la adopción responsable de perros y gatos en el norte del Valle de Aburrá.",
            verified: true,
            contactWhatsApp: "+573023456789",
            contactInstagram: "@amigospeludos_bello",
            userId: shelterUser2.id,
        },
    });

    const shelter3 = await prisma.shelter.create({
        data: {
            name: "Patitas Felices Envigado",
            nit: "900345678-3",
            municipality: Municipality.ENVIGADO,
            address: "Avenida El Poblado # 12-34",
            description: "Refugio especializado en el rescate de animales maltratados y su reinserción en hogares amorosos.",
            verified: true,
            contactWhatsApp: "+573034567890",
            contactInstagram: "@patitas_felices",
            userId: shelterUser3.id,
        },
    });

    const shelter4 = await prisma.shelter.create({
        data: {
            name: "Refugio Nueva Vida Itagüí",
            nit: "900456789-4",
            municipality: Municipality.ITAGUI,
            address: "Calle 85 # 43-67, Ditaires",
            description: "Brindamos una segunda oportunidad a animales en situación de calle en el sur del Área Metropolitana.",
            verified: true,
            contactWhatsApp: "+573045678901",
            contactInstagram: "@refugio_nuevavida",
            userId: shelterUser4.id,
        },
    });

    // Albergue pendiente de verificación
    await prisma.shelter.create({
        data: {
            name: "Nuevo Refugio Sabaneta",
            nit: "900567890-5",
            municipality: Municipality.SABANETA,
            address: "Carrera 43A # 10-20",
            description: "Nuevo refugio en proceso de verificación.",
            verified: false,
            contactWhatsApp: "+573056789012",
            userId: shelterUserPending.id,
        },
    });

    console.log("✅ Albergues creados.");

    // ─────────────────────────────────────────────
    // 3. VENDORS
    // ─────────────────────────────────────────────
    const vendor1 = await prisma.vendor.create({
        data: {
            businessName: "Mascotas Felices Store",
            businessPhone: "6044567890",
            description: "Tienda especializada en productos premium para el cuidado y bienestar de tus mascotas.",
            logo: PLACEHOLDER_LOGO,
            municipality: Municipality.MEDELLIN,
            address: "Calle 10 # 32-45, Astorga",
            verified: true,
            userId: vendorUser1.id,
        },
    });

    const vendor2 = await prisma.vendor.create({
        data: {
            businessName: "PetShop Valle",
            businessPhone: "6045678901",
            description: "Tu tienda de confianza para alimentos, accesorios y artículos veterinarios en Envigado.",
            logo: PLACEHOLDER_LOGO,
            municipality: Municipality.ENVIGADO,
            address: "Carrera 25 # 35-12, Envigado Centro",
            verified: true,
            userId: vendorUser2.id,
        },
    });

    // Vendor pendiente
    await prisma.vendor.create({
        data: {
            businessName: "PetCare Copacabana",
            businessPhone: "6046789012",
            description: "Tienda nueva en proceso de verificación.",
            municipality: Municipality.COPACABANA,
            address: "Calle 20 # 15-30, Copacabana Centro",
            verified: false,
            userId: vendorUserPending.id,
        },
    });

    console.log("✅ Vendors creados.");

    // ─────────────────────────────────────────────
    // 4. MASCOTAS
    // ─────────────────────────────────────────────

    // --- Shelter 1: Huellitas de Amor (Medellín) ---
    const pet1 = await prisma.pet.create({
        data: {
            name: "Max",
            species: "Perro",
            breed: "Labrador Retriever",
            age: 2,
            sex: "Macho",
            status: PetStatus.AVAILABLE,
            description: "Max es un perro joven, juguetón y lleno de energía. Le encanta correr en el parque y jugar con niños. Está vacunado y desparasitado.",
            requirements: "Hogar con espacio amplio. No apto para apartamentos pequeños. Familia activa que lo lleve a ejercitarse a diario.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter1.id,
        },
    });

    const pet2 = await prisma.pet.create({
        data: {
            name: "Luna",
            species: "Gato",
            breed: "Mestizo",
            age: 1,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Luna es una gata cariñosa y tranquila. Perfecta para vivir en apartamento. Se lleva bien con otros gatos.",
            requirements: "Ambiente tranquilo. Puede vivir con otras mascotas. Esterilizada.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter1.id,
        },
    });

    const pet3 = await prisma.pet.create({
        data: {
            name: "Rocky",
            species: "Perro",
            breed: "Pitbull Mestizo",
            age: 3,
            sex: "Macho",
            status: PetStatus.IN_PROCESS,
            description: "Rocky es un perro noble y leal que fue rescatado de la calle. Ha pasado por rehabilitación conductual y está listo para un nuevo hogar.",
            requirements: "Dueño con experiencia en perros de raza mediana. Sin niños menores de 5 años.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter1.id,
        },
    });

    const pet4 = await prisma.pet.create({
        data: {
            name: "Canela",
            species: "Perro",
            breed: "Beagle",
            age: 4,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Canela es una beagle juguetona con mucha energía. Le encantan los paseos largos y los juguetes interactivos.",
            requirements: "Jardín o acceso a parque. Familia con tiempo para paseos diarios.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter1.id,
        },
    });

    const pet5 = await prisma.pet.create({
        data: {
            name: "Simba",
            species: "Gato",
            breed: "Persa",
            age: 5,
            sex: "Macho",
            status: PetStatus.ADOPTED,
            description: "Simba encontró un hogar amoroso. Era un gato tranquilo y muy elegante.",
            requirements: "N/A",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter1.id,
        },
    });

    // --- Shelter 2: Amigos Peludos Bello ---
    const pet6 = await prisma.pet.create({
        data: {
            name: "Bella",
            species: "Perro",
            breed: "Golden Retriever",
            age: 1,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Bella es una cachorra dorada con una personalidad increíble. Ideal para familias con niños. Ama los abrazos y los juegos.",
            requirements: "Familia con tiempo y amor para darle. Espacio mínimo de apartamento grande.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter2.id,
        },
    });

    const pet7 = await prisma.pet.create({
        data: {
            name: "Michi",
            species: "Gato",
            breed: "Siamés",
            age: 2,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Michi es una gata siamesa muy inteligente y comunicativa. Le gusta explorar y jugar con juguetes de plumas.",
            requirements: "Ambiente enriquecido con juguetes. Puede vivir sola o con otro gato.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter2.id,
        },
    });

    const pet8 = await prisma.pet.create({
        data: {
            name: "Bruno",
            species: "Perro",
            breed: "Boxer",
            age: 3,
            sex: "Macho",
            status: PetStatus.AVAILABLE,
            description: "Bruno es un boxer leal y protector. Ama a su familia y es excelente con niños mayores.",
            requirements: "Casa con patio. Dueño activo.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter2.id,
        },
    });

    const pet9 = await prisma.pet.create({
        data: {
            name: "Nieve",
            species: "Gato",
            breed: "Angora",
            age: 6,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Nieve es una gata angora de pelaje largo y blanco. Muy tranquila, ideal para personas mayores o que buscan compañía serena.",
            requirements: "Cepillado frecuente. Ambiente tranquilo.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter2.id,
        },
    });

    // --- Shelter 3: Patitas Felices Envigado ---
    const pet10 = await prisma.pet.create({
        data: {
            name: "Toby",
            species: "Perro",
            breed: "Schnauzer",
            age: 2,
            sex: "Macho",
            status: PetStatus.AVAILABLE,
            description: "Toby es un schnauzer miniatura con mucho carácter. Inteligente, obediente y muy limpio.",
            requirements: "Apto para apartamento. Se lleva bien con niños.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter3.id,
        },
    });

    const pet11 = await prisma.pet.create({
        data: {
            name: "Cleo",
            species: "Gato",
            breed: "Mestizo",
            age: 3,
            sex: "Hembra",
            status: PetStatus.IN_PROCESS,
            description: "Cleo es una gata rescatada muy curiosa y juguetona. Le encanta asomarse a las ventanas y cazar juguetes.",
            requirements: "Hogar seguro, preferiblemente interior.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter3.id,
        },
    });

    const pet12 = await prisma.pet.create({
        data: {
            name: "Zeus",
            species: "Perro",
            breed: "Pastor Alemán",
            age: 4,
            sex: "Macho",
            status: PetStatus.AVAILABLE,
            description: "Zeus es un pastor alemán leal, inteligente y muy bien entrenado. Ideal para personas con experiencia en perros de trabajo.",
            requirements: "Dueño con experiencia. Espacio amplio. Entrenamiento continuo.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter3.id,
        },
    });

    // --- Shelter 4: Nueva Vida Itagüí ---
    const pet13 = await prisma.pet.create({
        data: {
            name: "Pelusa",
            species: "Conejo",
            breed: "Belier",
            age: 1,
            sex: "Hembra",
            status: PetStatus.AVAILABLE,
            description: "Pelusa es una coneja belier adorable y muy dócil. Come bien y le encanta que la acaricien.",
            requirements: "Jaula espaciosa. Dieta de heno y verduras frescas.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter4.id,
        },
    });

    const pet14 = await prisma.pet.create({
        data: {
            name: "Manchas",
            species: "Perro",
            breed: "Dálmata Mestizo",
            age: 2,
            sex: "Macho",
            status: PetStatus.AVAILABLE,
            description: "Manchas tiene un pelaje único y una personalidad alegre. Le encanta jugar con pelotas y correr.",
            requirements: "Familia activa. Espacio para correr.",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter4.id,
        },
    });

    const pet15 = await prisma.pet.create({
        data: {
            name: "Perla",
            species: "Gato",
            breed: "British Shorthair",
            age: 3,
            sex: "Hembra",
            status: PetStatus.ADOPTED,
            description: "Perla ya fue adoptada. Era una gata tranquila y muy afectuosa.",
            requirements: "N/A",
            images: [PLACEHOLDER_PET_IMAGE],
            shelterId: shelter4.id,
        },
    });

    console.log("✅ Mascotas creadas.");

    // ─────────────────────────────────────────────
    // 5. PRODUCTOS
    // ─────────────────────────────────────────────

    // --- Vendor 1: Mascotas Felices Store ---
    await prisma.product.createMany({
        data: [
            {
                name: "Alimento Premium para Perros Adultos 15kg",
                price: 85000,
                stock: 50,
                category: "Alimentos",
                description: "Alimento balanceado de alta calidad con proteínas reales de pollo y vegetales. Sin colorantes artificiales.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Alimento Húmedo para Gatos 400g",
                price: 12000,
                stock: 120,
                category: "Alimentos",
                description: "Lata de alimento húmedo con atún y salmón. Rico en Omega 3 para pelaje brillante.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Cama Ortopédica para Perros Talla M",
                price: 145000,
                stock: 20,
                category: "Accesorios",
                description: "Cama con memoria de forma y cubierta lavable. Ideal para perros con problemas articulares.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Arnés Reflectivo Talla S",
                price: 38000,
                stock: 35,
                category: "Accesorios",
                description: "Arnés ergonómico con cintas reflectivas para paseos nocturnos seguros.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Juguete Kong Classic Talla M",
                price: 55000,
                stock: 45,
                category: "Juguetes",
                description: "Juguete de goma natural resistente para rellenar con premios. Estimulación mental para perros.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Champú Antipulgas para Mascotas 500ml",
                price: 28000,
                stock: 60,
                category: "Higiene",
                description: "Champú de uso frecuente con extractos naturales de neem. Repele pulgas y garrapatas.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Transportador de Tela para Gatos",
                price: 95000,
                stock: 15,
                category: "Accesorios",
                description: "Bolso transportador suave, ventilado y aprobado para cabina de avión. Fácil de limpiar.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
            {
                name: "Pipeta Antiparasitaria para Perros >25kg",
                price: 42000,
                stock: 80,
                category: "Salud",
                description: "Antiparasitario externo de amplio espectro. Protege contra pulgas, garrapatas y mosquitos por 30 días.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor1.id,
            },
        ],
    });

    // --- Vendor 2: PetShop Valle ---
    await prisma.product.createMany({
        data: [
            {
                name: "Snack Dental para Perros x18",
                price: 32000,
                stock: 90,
                category: "Alimentos",
                description: "Galletas masticables que ayudan a reducir el sarro y el mal aliento. Sabor a menta.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Arena Aglomerante para Gatos 5kg",
                price: 35000,
                stock: 70,
                category: "Higiene",
                description: "Arena de sílice con control de olor por 30 días. Sin polvo, aglomerante al instante.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Rascador Torre para Gatos",
                price: 120000,
                stock: 12,
                category: "Accesorios",
                description: "Torre de sisal de 3 pisos con plataformas, cueva y juguetes colgantes. Ideal para gatos activos.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Correa Retráctil 5 metros",
                price: 68000,
                stock: 25,
                category: "Accesorios",
                description: "Correa retráctil con freno de seguridad, mango ergonómico y cinta de 5m. Para perros hasta 20kg.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Vitaminas Multivitamínico Canino x60",
                price: 52000,
                stock: 40,
                category: "Salud",
                description: "Suplemento masticable con vitaminas A, D, E y complejo B para la salud general del perro.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Fuente de Agua para Mascotas 1.5L",
                price: 88000,
                stock: 18,
                category: "Accesorios",
                description: "Fuente eléctrica con filtro de carbón activado. Mantiene el agua fresca y limpia 24/7.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Alimento para Conejos Premium 2kg",
                price: 29000,
                stock: 30,
                category: "Alimentos",
                description: "Mezcla de heno, pellets y vegetales deshidratados. Dieta balanceada para conejos adultos.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
            {
                name: "Cepillo Deslizante para Pelo Largo",
                price: 25000,
                stock: 55,
                category: "Higiene",
                description: "Cepillo de cerdas de acero inoxidable curvo. Ideal para razas de pelo largo como golden y collie.",
                images: [PLACEHOLDER_PRODUCT_IMAGE],
                vendorId: vendor2.id,
            },
        ],
    });

    console.log("✅ Productos creados.");

    // ─────────────────────────────────────────────
    // 6. ADOPCIONES
    // ─────────────────────────────────────────────
    const adoptions = await prisma.adoption.createMany({
        data: [
            // Pendientes
            {
                adopterId: adopters[0].id,
                petId: pet1.id,
                status: AdoptionStatus.PENDING,
                message: "Tengo un jardín grande y quiero darle a Max todo el amor que merece. Vivo con mi esposo y dos hijos de 8 y 12 años.",
            },
            {
                adopterId: adopters[1].id,
                petId: pet6.id,
                status: AdoptionStatus.PENDING,
                message: "Bella sería el primer perro de mi familia. Tenemos apartamento grande y tiempo para cuidarla.",
            },
            {
                adopterId: adopters[2].id,
                petId: pet2.id,
                status: AdoptionStatus.PENDING,
                message: "Busco una gata tranquila para hacerme compañía. Vivo sola y trabajo desde casa.",
            },
            // Aprobadas
            {
                adopterId: adopters[3].id,
                petId: pet3.id,
                status: AdoptionStatus.APPROVED,
                message: "Tengo experiencia con perros medianos. Rocky estaría en buenas manos.",
            },
            {
                adopterId: adopters[4].id,
                petId: pet11.id,
                status: AdoptionStatus.APPROVED,
                message: "Me encantó Cleo desde la primera foto. Soy una amante de los gatos.",
            },
            // Rechazadas
            {
                adopterId: adopters[5].id,
                petId: pet12.id,
                status: AdoptionStatus.REJECTED,
                message: "Quiero adoptar a Zeus.",
            },
            // Adoptado (histórico)
            {
                adopterId: adopters[3].id,
                petId: pet5.id,
                status: AdoptionStatus.APPROVED,
                message: "Quiero adoptar a Simba.",
            },
        ],
    });

    console.log("✅ Adopciones creadas.");

    // ─────────────────────────────────────────────
    // 7. FAVORITOS
    // ─────────────────────────────────────────────
    await prisma.favorite.createMany({
        data: [
            { userId: adopters[0].id, petId: pet1.id },
            { userId: adopters[0].id, petId: pet2.id },
            { userId: adopters[0].id, petId: pet6.id },
            { userId: adopters[1].id, petId: pet6.id },
            { userId: adopters[1].id, petId: pet8.id },
            { userId: adopters[2].id, petId: pet2.id },
            { userId: adopters[2].id, petId: pet7.id },
            { userId: adopters[3].id, petId: pet10.id },
            { userId: adopters[4].id, petId: pet4.id },
            { userId: adopters[4].id, petId: pet9.id },
            { userId: adopters[5].id, petId: pet14.id },
            { userId: adopters[5].id, petId: pet13.id },
        ],
    });

    console.log("✅ Favoritos creados.");

    // ─────────────────────────────────────────────
    // 8. ÓRDENES
    // ─────────────────────────────────────────────

    // Obtener productos creados para referencias
    const products = await prisma.product.findMany({ take: 16 });
    const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16] = products;

    // Orden 1 - Sofia - DELIVERED
    await prisma.order.create({
        data: {
            userId: adopters[0].id,
            status: OrderStatus.DELIVERED,
            total: 151000,
            shippingMunicipality: Municipality.MEDELLIN,
            shippingAddress: "Calle 5 # 43D-12, El Poblado",
            paymentMethod: "Efectivo contra entrega",
            items: {
                create: [
                    { productId: p1.id, quantity: 1, price: p1.price },
                    { productId: p5.id, quantity: 1, price: p5.price },
                    { productId: p2.id, quantity: 1, price: p2.price },
                ],
            },
        },
    });

    // Orden 2 - Juan - CONFIRMED
    await prisma.order.create({
        data: {
            userId: adopters[1].id,
            status: OrderStatus.CONFIRMED,
            total: 206000,
            shippingMunicipality: Municipality.BELLO,
            shippingAddress: "Calle 50 # 45-23, Bello",
            paymentMethod: "Transferencia bancaria",
            items: {
                create: [
                    { productId: p3.id, quantity: 1, price: p3.price },
                    { productId: p4.id, quantity: 1, price: p4.price },
                    { productId: p6.id, quantity: 1, price: p6.price },
                ],
            },
        },
    });

    // Orden 3 - Valentina - PENDING
    await prisma.order.create({
        data: {
            userId: adopters[2].id,
            status: OrderStatus.PENDING,
            total: 155000,
            shippingMunicipality: Municipality.SABANETA,
            shippingAddress: "Carrera 43 # 60-10, Sabaneta",
            paymentMethod: "Efectivo contra entrega",
            items: {
                create: [
                    { productId: p11.id, quantity: 1, price: p11.price },
                    { productId: p10.id, quantity: 2, price: p10.price },
                    { productId: p16.id, quantity: 1, price: p16.price },
                ],
            },
        },
    });

    // Orden 4 - Miguel - SHIPPED
    await prisma.order.create({
        data: {
            userId: adopters[3].id,
            status: OrderStatus.SHIPPED,
            total: 178000,
            shippingMunicipality: Municipality.ITAGUI,
            shippingAddress: "Calle 77 # 50-30, Itagüí",
            paymentMethod: "Transferencia bancaria",
            items: {
                create: [
                    { productId: p8.id, quantity: 2, price: p8.price },
                    { productId: p13.id, quantity: 1, price: p13.price },
                    { productId: p9.id, quantity: 2, price: p9.price },
                ],
            },
        },
    });

    // Orden 5 - Ana - CANCELLED
    await prisma.order.create({
        data: {
            userId: adopters[4].id,
            status: OrderStatus.CANCELLED,
            total: 88000,
            shippingMunicipality: Municipality.ENVIGADO,
            shippingAddress: "Avenida Las Vegas # 5-67",
            paymentMethod: "Efectivo contra entrega",
            items: {
                create: [
                    { productId: p6.id, quantity: 1, price: p6.price },
                    { productId: p14.id, quantity: 2, price: p14.price },
                ],
            },
        },
    });

    // Orden 6 - Nicolás - DELIVERED (segunda compra)
    await prisma.order.create({
        data: {
            userId: adopters[5].id,
            status: OrderStatus.DELIVERED,
            total: 225000,
            shippingMunicipality: Municipality.MEDELLIN,
            shippingAddress: "Circular 73 # 39-45, Laureles",
            paymentMethod: "Transferencia bancaria",
            items: {
                create: [
                    { productId: p1.id, quantity: 2, price: p1.price },
                    { productId: p15.id, quantity: 1, price: p15.price },
                ],
            },
        },
    });

    console.log("✅ Órdenes creadas.");

    // ─────────────────────────────────────────────
    // 9. AUDITORÍA (UserAudit)
    // ─────────────────────────────────────────────
    await prisma.userAudit.createMany({
        data: [
            {
                action: AuditAction.BLOCK,
                reason: "El usuario reportó comportamiento inapropiado hacia los albergues.",
                adminId: admin.id,
                userId: adopters[6].id, // usuario bloqueado
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Windows NT 10.0)",
            },
            {
                action: AuditAction.CHANGE_ROLE,
                reason: "Cambio de rol solicitado por el usuario para acceder al panel de albergue.",
                oldValue: "ADOPTER",
                newValue: "SHELTER",
                adminId: admin.id,
                userId: adopters[5].id,
                ipAddress: "192.168.1.101",
                userAgent: "Mozilla/5.0 (Macintosh)",
            },
        ],
    });

    console.log("✅ Registros de auditoría creados.");

    // ─────────────────────────────────────────────
    // Resumen
    // ─────────────────────────────────────────────
    console.log("\n🎉 Seeder completado exitosamente!");
    console.log("─────────────────────────────────────");
    console.log(`👤 Usuarios:    ${await prisma.user.count()}`);
    console.log(`🏠 Albergues:   ${await prisma.shelter.count()}`);
    console.log(`🛒 Vendors:     ${await prisma.vendor.count()}`);
    console.log(`🐾 Mascotas:    ${await prisma.pet.count()}`);
    console.log(`📦 Productos:   ${await prisma.product.count()}`);
    console.log(`❤️  Adopciones:  ${await prisma.adoption.count()}`);
    console.log(`⭐ Favoritos:   ${await prisma.favorite.count()}`);
    console.log(`🛍️  Órdenes:     ${await prisma.order.count()}`);
    console.log("─────────────────────────────────────");
    console.log("\n📋 Credenciales de acceso (todas con password: Password123!)");
    console.log("  Admin:    admin@pawlig.com");
    console.log("  Shelter:  refugio.huellitas@pawlig.com");
    console.log("  Vendor:   mascotas.felices@pawlig.com");
    console.log("  Adopter:  sofia.martinez@gmail.com");
}

main()
    .catch((e) => {
        console.error("❌ Error en el seeder:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });