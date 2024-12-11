import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function initProduct() {
  try {

    
      let dataproduct = [
        {
          name: "Giày Thể Thao Nam Biti’s Hunter Running LiteDual - Original Edition 2K24 HSM004801XLC",
          description: "Giày Thể Thao Nam Biti’s Hunter Running LiteDual - Original Edition 2K24 HSM004801XLC",
          price: 3400000,
          image: "https://product.hstatic.net/1000230642/product/hsm004801xlc-7_b04b277714894d7288870ca8b1df139b_master.jpg",
          createdAt: new Date(),
        },
        
       {
        name: `Giày Thể Thao Nam Biti’s Hunter X LiteDash - Midnight Edition HSM007503DEN
`,
        description: `Giày Thể Thao Nam Biti’s Hunter X LiteDash - Midnight Edition HSM007503DEN
`,
        price: 2340000,
        image:`https://product.hstatic.net/1000230642/product/hsm007503den-7_28fafb0b299f4b0e9744c1d24d0df891_master.jpg`,
        createdAt: new Date(),
      },
       {
        name: `Giày Thể Thao Nam Biti’s Hunter Core LiteFoam 3.0 - Original Edition 2K24 HSM007801XAM
`,
        description: `Giày Thể Thao Nam Biti’s Hunter Core LiteFoam 3.0 - Original Edition 2K24 HSM007801XAM
`,
        price: 850000,
        image:`https://product.hstatic.net/1000230642/product/hsm007801xam-7_2635ef1ee15241d4821efae52c7148dd_master.jpg`,
        createdAt: new Date(),
      },
       {
        name: `Giày Thể Thao Nam Biti’s Hunter X LiteDash - Original Edition 2K24 HSM007506DOD
`,
        description: `Giày Thể Thao Nam Biti’s Hunter X LiteDash - Original Edition 2K24 HSM007506DOD
`,
        price: 950000,
        image:`https://product.hstatic.net/1000230642/product/hsm007506dod-7_81f41306f3e74b4c98473ffae30c4077_master.jpg`,
        createdAt: new Date(),
      },
       {
        name: `Giày Thể Thao Nam Biti's Hunter Street HSM008600NAD
`,
        description: `Giày Thể Thao Nam Biti's Hunter Street HSM008600NAD
`,
        price: 659000,
        image:`https://product.hstatic.net/1000230642/product/hsm004801cam-7_d78e7e9261bf47f3a38b33be304223e1_master.jpg`,
        createdAt: new Date(),
      }
        // Các sản phẩm khác...
      ];

      for (const item of dataproduct) {
        await prisma.product.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            createdAt: item.createdAt,
          },
        });
      }
    

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
