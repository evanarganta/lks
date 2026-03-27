import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function ProductLinesList() {
  const [productLines, setProductLines] = useState([]);
  const [filteredProductLines, setFilteredProductLines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProductLine, setEditingProductLine] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    productLine: "",
    textDescription: "",
    htmlDescription: "",
    image: "",
  });

  const fetchProductLines = async () => {
    setLoading(true);
    try {
      const response = await api.get("/productlines");
      const productLinesData = response.data.data || response.data || [];
      setProductLines(productLinesData);
      setFilteredProductLines(productLinesData);
    } catch (error) {
      console.error("Fetch ProductLines Error", error);
      setProductLines([]);
      setFilteredProductLines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductLines();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredProductLines(productLines);
    } else {
      const filtered = productLines.filter(
        (productLine) =>
          productLine.productLine
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          productLine.textDescription
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      setFilteredProductLines(filtered);
    }
    setCurrentPage(1);
  }, [search, productLines]);

  const totalPages = Math.ceil(filteredProductLines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductLines = filteredProductLines.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (productLine) => {
    if (confirm("Are you sure you want to delete this product line?")) {
      try {
        await api.delete(`/productlines/${productLine}`);
        await fetchProductLines();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete product line");
      }
    }
  };

  const handleEdit = (productLine) => {
    setEditingProductLine(productLine);
    setFormData({
      productLine: productLine.productLine,
      textDescription: productLine.textDescription || "",
      htmlDescription: productLine.htmlDescription || "",
      image: productLine.image || "",
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingProductLine(null);
    setFormData({
      productLine: "",
      textDescription: "",
      htmlDescription: "",
      image: "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductLine) {
        await api.put(
          `/productlines/${editingProductLine.productLine}`,
          formData
        );
      } else {
        await api.post("/productlines", formData);
      }
      setShowAddModal(false);
      await fetchProductLines();
    } catch (error) {
      console.error("Submit failed:", error);
      alert(`Failed to ${editingProductLine ? "update" : "add"} product line`);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Line List</h2>
        <button
          onClick={handleAdd}
          className="transition-colors rounded-lg bg-green-500 text-white hover:bg-green-600 px-4 py-2"
        >
          Add Product Line
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product line..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Text Description</th>
                  <th className="border p-2">HTML Description</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProductLines.length > 0 ? (
                  currentProductLines.map((productLine) => (
                    <tr
                      key={productLine.productLine}
                      className="hover:bg-gray-50"
                    >
                      <td className="border p-2">{productLine.productLine}</td>
                      <td className="border p-2 max-w-xs truncate">
                        {productLine.textDescription}
                      </td>
                      <td className="border p-2 max-w-xs truncate">
                        {productLine.htmlDescription || "N/A"}
                      </td>
                      <td className="border p-2 max-w-xs truncate">
                        {productLine.image || "N/A"}
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(productLine)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(productLine.productLine)
                            }
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="border p-4 text-center text-gray-500"
                    >
                      No product lines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed rounded"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed rounded"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingProductLine
                ? "Edit Product Line"
                : "Add New Product Line"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Product Line
                </label>
                <input
                  type="text"
                  name="productLine"
                  value={formData.productLine}
                  onChange={handleInputChange}
                  required
                  disabled={editingProductLine !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Text Description
                </label>
                <textarea
                  name="textDescription"
                  value={formData.textDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  HTML Description
                </label>
                <textarea
                  name="htmlDescription"
                  value={formData.htmlDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  {editingProductLine ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
