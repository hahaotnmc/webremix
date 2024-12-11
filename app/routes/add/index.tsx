import { json, LoaderFunction, redirect } from "@remix-run/node";
import React, { useState } from "react";
import { addProduct } from "~/API/addProduct";
import { getProducts } from "~/API/products";
import ProductList from "~/components/listProduct";
import Menu from "~/components/menu";


export  const loader: LoaderFunction = ()=>{
    
    return getProducts();
}
export const action = async ({ request }: { request: Request }) => {
  const formData = new URLSearchParams(await request.text());  // Trích xuất dữ liệu từ request (POST form)

  // Lấy các giá trị từ form
  const name = formData.get('name') ?? '';
  const description = formData.get('description') ?? '';
  const price = parseFloat(formData.get('price') ?? '0');
  const image = formData.get('image') ?? '';

  // Kiểm tra dữ liệu hợp lệ
  if (!name || !description || !price || !image) {
    return json({ error: 'All fields are required!' }, { status: 400 });
  }

  try {
    // Thêm sản phẩm vào cơ sở dữ liệu
    await addProduct({ name, description, price, image });

    // Điều hướng đến trang danh sách sản phẩm sau khi thêm thành công
    return redirect('/');
  } catch (error) {
    console.error('Error adding product:', error);
    return json({ error: 'Something went wrong while adding the product.' }, { status: 500 });
  } }

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div>
        <div>
            <Menu/>
        </div>

    <div className=" mt-3 mx-auto p-6 bg-white rounded-lg shadow-md">

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Thêm Sản Phẩm</h2>
      <form method="post">
        <div className="grid grid-cols-1 gap-4">
          {/* Tên sản phẩm */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên sản phẩm
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên sản phẩm"
              required
              />
          </div>

          {/* Mô tả sản phẩm */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả sản phẩm
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả sản phẩm"
              rows={4}
              required
              />
          </div>

          {/* Giá sản phẩm */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Giá sản phẩm (VND)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập giá sản phẩm"
              required
              />
          </div>

          {/* Hình ảnh */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Đường dẫn hình ảnh
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập URL hình ảnh"
              required
              />
          </div>
        </div>

        {/* Nút gửi */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            Thêm Sản Phẩm
          </button>
        </div>
      </form>
    </div>
    <div className=" mt-3">
        <ProductList/>
    </div>
    </div>
  );
}
