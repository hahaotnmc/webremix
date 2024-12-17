import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function initProduct() {
  try {
    // Dữ liệu mẫu cho thẻ (tags)
    const tags = [
      { name: "Giày dép" },
      { name: "Quần áo" },
      { name: "Phụ kiện" },
    ];

    // Dữ liệu mẫu cho sản phẩm
    const dataproduct = [
      {
        name: "Giày Thể Thao Nam Biti’s Hunter Running LiteDual - Original Edition 2K24 HSM004801XLC",
        description: "Giày Thể Thao Nam Biti’s Hunter Running LiteDual - Original Edition 2K24 HSM004801XLC",
        price: 122.4,
        image: "https://product.hstatic.net/1000230642/product/hsm004801xlc-7_b04b277714894d7288870ca8b1df139b_master.jpg",
        createdAt: new Date(),
        tagId: 1, // Liên kết thẻ
      },
      {
        name: "Giày Thể Thao Nam Biti’s Hunter X LiteDash - Midnight Edition HSM007503DEN",
        description: "Giày Thể Thao Nam Biti’s Hunter X LiteDash - Midnight Edition HSM007503DEN",
        price: 23.4,
        image: "https://product.hstatic.net/1000230642/product/hsm007503den-7_28fafb0b299f4b0e9744c1d24d0df891_master.jpg",
        createdAt: new Date(),
        tagId: 1,
      },
      {
        name: "Giày Thể Thao Nam Biti’s Hunter Core LiteFoam 3.0 - Original Edition 2K24 HSM007801XAM",
        description: "Giày Thể Thao Nam Biti’s Hunter Core LiteFoam 3.0 - Original Edition 2K24 HSM007801XAM",
        price: 85.5,
        image: "https://product.hstatic.net/1000230642/product/hsm007801xam-7_2635ef1ee15241d4821efae52c7148dd_master.jpg",
        createdAt: new Date(),
        tagId: 1,
      },
    ];
   

    // 1. Tạo hoặc tìm các thẻ (tags)
    const alltags = prisma.tag.findMany()||[];

    for (const taginit of tags) {
      
      let dem = 0;
      for (const tag of await alltags)
      {
        if(taginit.name == tag.name){
          dem ++;
        }
      }
      if(dem==0){
        await prisma.tag.create({
          data: {
            name: taginit.name,
          },
        });
        console.log(`Đã tạo tag: ${taginit.name}`);
      }
    }

   // 2. Tạo sản phẩm và liên kết với các thẻ
    for (const product of dataproduct) {
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          createdAt: product.createdAt,
          tagId: product.tagId,
        },
      });

      console.log(`Đã tạo sản phẩm: ${createdProduct.name}`);
    }
  } catch (error) {
    console.error("Lỗi khi khởi tạo sản phẩm:", error);
  } finally {
    await prisma.$disconnect();
  }
}
