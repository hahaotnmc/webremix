
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { addProduct } from "~/API/addProduct";


import Menu from "~/components/menu";
import { PrismaClient } from "@prisma/client";
// Loader để fetch dữ liệu

const prisma = new PrismaClient;





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

export const action = async ({ request }: { request: Request }) => {
  const formData = new URLSearchParams(await request.text());  // Trích xuất dữ liệu từ request (POST form)
  const actionType = formData.get('actionType');
  if (actionType === 'submitForm') {
    // Lấy các giá trị từ form
    const name = formData.get('name') ?? '';
    const description = formData.get('description') ?? '';
    const price = parseFloat(formData.get('price') ?? '0');
    const image = formData.get('image') ?? '';
    const tagID = parseInt(formData.get('tagID') ?? '0');

    // Kiểm tra dữ liệu hợp lệ
    if (!name || !description || !price || !image || !tagID) {
      return json({ error: 'Nhập tất cả các trường!' }, { status: 400 });
    }
    console.log({ name, description, price, image ,tagID});
    

    try {
      // Thêm sản phẩm vào cơ sở dữ liệu
      await addProduct({ name, description, price, image ,tagID});
      return redirect('/');
    } catch (error) {
      console.error('Error adding product:', error);
      return json({ error: 'Something went wrong while adding the product.' }, { status: 500 });
    } 
  }
}


export default function AddProductForm() {
  const { tags2 = [], products = []} = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    tag:'',
  });
   const fetcher = useFetcher();

function handleAddTag(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, tagdata: string) {
    event.preventDefault();

    if (!tagdata.trim()) {
      alert("Nhập tag mới trước để thêm tag!");
      return;
    }

    // Gửi yêu cầu POST đến API route để thêm tag
    fetcher.submit(
      { tagName: tagdata }, // Dữ liệu gửi đi, đây là tên tag mới
      { method: "post", action: "app/API/addtag" } // Đảm bảo action trỏ tới API route đã định nghĩa
    );
  }

  
  
  const findTag = (tagId: number) => {
    const tag = tags2.find((t:any) => t.id === tagId);
    return tag ? tag.name : "No tag";
  };

  const [tag, setTag] = useState('');
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTag(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div>
        <div>
            <Menu/>
        </div>

    <div className="mt-3 mx-auto p-6 bg-white rounded-lg shadow-md">
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

      {/* Tag sản phẩm */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
            Tag sản phẩm
          </label>
          <select
            id="tag"
            name="tagID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>-- Chọn Tag --</option>
            {tags2.map((tagitem:any) => (
              <option key={tagitem.id} value={tagitem.id}>{tagitem.name}</option>
            ))}
          </select>
        </div>

        
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
              name="actionType"
              value="submitForm"
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
        Thêm Sản Phẩm
      </button>
    </div>
  </form>

  
</div>
<div className="mt-3 mx-auto p-6 bg-white rounded-lg shadow-md">
  <form method="post" action="/addtag">
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Add tag sản phẩm
        </label>
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            id="tag"
            name="tag"
            value={tag}
            onChange={handleTagChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập Tag"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ADD tag
          </button>
        </div>
      </div>
    </form>
</div>
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Product Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Tag</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product:any) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{product.id}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.description}</td>
                <td className="px-4 py-2 border text-center">${product.price}</td>
                <td className="px-4 py-2 border text-center">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border text-center">{findTag(product.tagId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    </div>
  );
}


