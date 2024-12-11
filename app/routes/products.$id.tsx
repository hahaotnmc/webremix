import { PrismaClient } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CartWithProduct } from "~/API/carts";
import Menu from "~/components/menu";

// Kiểu dữ liệu sản phẩm
export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
};

// Hàm lấy sản phẩm theo id
export async function getProduct(id: number) {
    const prisma = new PrismaClient();
    // Sử dụng findUnique để lấy một sản phẩm theo id
    const product = await prisma.product.findUnique({
        where: { id: id },
    });
    return product;
}

// Loader hàm để lấy dữ liệu sản phẩm theo id
export const loader: LoaderFunction = async ({ params }) => {
    const { id } = params; // Lấy id từ dynamic segment
    if (id) {
        return await getProduct(Number(id)); // Chuyển id thành số
    }
    return null; // Trả về null nếu không có id
};
async function handleAddcart(productid: number) {
    
    // Lấy dữ liệu từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const products = JSON.parse((localStorage.getItem('products')) || '[]');

    // Tìm sản phẩm từ danh sách products
    const product = products.products.find((p: { id: any; }) => p.id === productid);
    if (!product) {
        throw new Error('Product not found');
    }
    

    // Thêm sản phẩm vào giỏ hàng
    const existingCartItem = cart.find((c:CartWithProduct) => c.productId === productid);

    let updatedCart: CartWithProduct[];
    if (existingCartItem) {
        // Nếu đã có, tăng số lượng
        updatedCart = cart.map((c:CartWithProduct) =>
            c.productId === productid ? { ...c, quantity: c.quantity + 1 } : c
        );
    } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
        const maxId = cart.reduce((max:any, item:any) => (item.id > max ? item.id : max), 0);
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
        alert("Sản phẩm: "+ product.name+" vừa được thêm vào giỏ hàng");

}
export default function TestProduct() {
    const product = useLoaderData<Product>(); // Lấy dữ liệu sản phẩm từ loader

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <div >
                <Menu/>
            </div>

            <div className=" container mx-auto mb-5 px-4 py-8">
                <div className="flex flex-col  md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Hình ảnh sản phẩm */}
                    <div className="w-3/5  md:w-1/2">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full  object-cover"
                        />
                    </div>
                    {/* Chi tiết sản phẩm */}
                    <div className="w-3/5 md:w-1/2 p-6 flex flex-col justify-between">
                        {/* Nội dung phía trên */}
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-lg text-gray-600 mt-2">{product.description}</p>
                        </div>
                        
                        {/* Giá và nút ở cuối */}
                        <div className="mt-6">
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-800">{product.price.toLocaleString()} VND</span>
                            </div>
                            <button 
                                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                                onClick={()=>{handleAddcart(product.id)}}
                                >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
