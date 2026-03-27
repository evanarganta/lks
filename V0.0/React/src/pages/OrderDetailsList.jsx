import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function OrderDetailsList() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrderDetails, setFilteredOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOrderDetail, setEditingOrderDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    orderNumber: "",
    productCode: "",
    quantityOrdered: "",
    priceEach: "",
    orderLineNumber: "",
  });

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orderdetails");
      const orderDetailsData = response.data.data || response.data || [];
      setOrderDetails(orderDetailsData);
      setFilteredOrderDetails(orderDetailsData);
    } catch (error) {
      console.error("Fetch order details Error", error);
      setOrderDetails([]);
      setFilteredOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOrderDetails(orderDetails);
    } else {
      const filtered = orderDetails.filter(
        (orderDetail) =>
          orderDetail.orderNumber
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          orderDetail.productCode
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          orderDetail.quantityOrdered.toString().includes(search) ||
          orderDetail.priceEach.toString().includes(search)
      );
      setFilteredOrderDetails(filtered);
    }
    setCurrentPage(1);
  }, [search, orderDetails]);

  const totalPages = Math.ceil(filteredOrderDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrderDetails = filteredOrderDetails.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (orderNumber, productCode) => {
    if (confirm("Are you sure you want to delete this order detail?")) {
      try {
        await api.delete(`/orderdetails/${orderNumber}/${productCode}`);
        await fetchOrderDetails();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete order detail");
      }
    }
  };

  const handleEdit = (orderDetail) => {
    setEditingOrderDetail(orderDetail);
    setFormData({
      orderNumber: orderDetail.orderNumber,
      productCode: orderDetail.productCode,
      quantityOrdered: orderDetail.quantityOrdered,
      priceEach: orderDetail.priceEach,
      orderLineNumber: orderDetail.orderLineNumber,
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingOrderDetail(null);
    setFormData({
      orderNumber: "",
      productCode: "",
      quantityOrdered: "",
      priceEach: "",
      orderLineNumber: "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrderDetail) {
        await api.put(
          `/orderdetails/${editingOrderDetail.orderNumber}/${editingOrderDetail.productCode}`,
          formData
        );
      } else {
        await api.post("/orderdetails", formData);
      }
      setShowAddModal(false);
      await fetchOrderDetails();
    } catch (error) {
      console.error("Submit failed:", error);
      alert(`Failed to ${editingOrderDetail ? "update" : "add"} order detail`);
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
        <h2 className="text-2xl font-semibold">Order Detail List</h2>
        <button
          onClick={handleAdd}
          className="transition-colors rounded-lg bg-green-500 text-white hover:bg-green-600 px-4 py-2"
        >
          Add Order Detail
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search order detail..."
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
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Product ID</th>
                  <th className="border p-2">Quantity Ordered</th>
                  <th className="border p-2">Price Each</th>
                  <th className="border p-2">Order Line Number</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrderDetails.length > 0 ? (
                  currentOrderDetails.map((orderDetail) => (
                    <tr
                      key={`${orderDetail.orderNumber}-${orderDetail.productCode}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="border p-2">{orderDetail.orderNumber}</td>
                      <td className="border p-2">{orderDetail.productCode}</td>
                      <td className="border p-2">
                        {orderDetail.quantityOrdered}
                      </td>
                      <td className="border p-2">
                        ${parseFloat(orderDetail.priceEach).toFixed(2)}
                      </td>
                      <td className="border p-2">
                        {orderDetail.orderLineNumber}
                      </td>
                      <td className="border p-2 font-semibold">
                        $
                        {(
                          parseFloat(orderDetail.priceEach) *
                          parseInt(orderDetail.quantityOrdered)
                        ).toFixed(2)}
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(orderDetail)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                orderDetail.orderNumber,
                                orderDetail.productCode
                              )
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
                      colSpan="7"
                      className="border p-4 text-center text-gray-500"
                    >
                      No order details found
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {editingOrderDetail
                ? "Edit Order Detail"
                : "Add New Order Detail"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Order Number
                  </label>
                  <input
                    type="number"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    required
                    disabled={editingOrderDetail !== null}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    required
                    disabled={editingOrderDetail !== null}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Quantity Ordered
                  </label>
                  <input
                    type="number"
                    name="quantityOrdered"
                    value={formData.quantityOrdered}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Price Each
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="priceEach"
                    value={formData.priceEach}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Order Line Number
                  </label>
                  <input
                    type="number"
                    name="orderLineNumber"
                    value={formData.orderLineNumber}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formData.quantityOrdered && formData.priceEach && (
                  <div className="col-span-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Total Amount: </span>$
                      {(
                        parseFloat(formData.priceEach || 0) *
                        parseInt(formData.quantityOrdered || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                )}
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
                  {editingOrderDetail ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
