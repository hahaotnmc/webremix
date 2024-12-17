import { PrismaClient } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { CartWithProduct } from "~/API/carts";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
  
    
  try {
    // Lấy dữ liệu từ database
    const tags2 = await prisma.tag.findMany();
    const products = await prisma.product.findMany();

    
    // Trả về dữ liệu dưới dạng JSON
    return json({
      tags2: tags2 || [],
      products: products || [],
    });
  } catch (error) {
    throw new Response("Failed to load data", { status: 500 });
  }
};

async function handleAddcart(productid: number) {
  // Lấy dữ liệu từ localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');

  // Tìm sản phẩm từ danh sách products
  const product = products.products.find((p: { id: any; }) => p.id === productid);
  if (!product) {
    throw new Error('Product not found');
  }

  // Thêm sản phẩm vào giỏ hàng
  const existingCartItem = cart.find((c: CartWithProduct) => c.productId === productid);

  let updatedCart: CartWithProduct[];
  if (existingCartItem) {
    // Nếu đã có, tăng số lượng
    updatedCart = cart.map((c: CartWithProduct) =>
      c.productId === productid ? { ...c, quantity: c.quantity + 1 } : c
    );
  } else {
    const maxId = cart.reduce((max: any, item: any) => (item.id > max ? item.id : max), 0);
    const newCartItem: CartWithProduct = {
      id: maxId + 1, // ID là lớn nhất hiện có + 1
      productId: productid,
      quantity: 1,
      product: product,
    };
    updatedCart = [...cart, newCartItem];
  }

  // Lưu lại giỏ hàng vào localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  alert("Sản phẩm: " + product.name + " vừa được thêm vào giỏ hàng");
}

export default function ProductList() {
  const { tags2 = [], products = [] } = useLoaderData<typeof loader>();
    
  // Lưu trữ products vào localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify({ products }));
  }, [products]);

  // Hàm tìm tên tag từ tagId
  const findTagName = (tagId: number) => {
    const tag = tags2.find((t:any) => t.id === tagId);
    return tag ? tag.name : 'No tag'; // Trả về tên tag hoặc 'No tag' nếu không tìm thấy
  };

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product: any) => (
        <div
          key={product.id}
          className="border rounded-lg shadow-md bg-white overflow-hidden flex flex-col h-full"
        >
          <Link to={'/products/' + product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
            </div>
          </Link>
          <div className="p-4 flex flex-col justify-between flex-grow max-h-24">
            <p className="text-indigo-500 font-bold mt-1">
              Loại SP: {findTagName(product.tagId)} {/* Hiển thị tên tag */}
            </p>
            <p className="text-indigo-500 font-bold mt-1">
              Giá: ${product.price}
            </p>
          </div>
          <button
            className="m-2 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition mt-auto"
            onClick={() => handleAddcart(product.id)}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      ))}
    </div>
  );
}
