import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    orderNumber: "",
    orderDate: "",
    requiredDate: "",
    shippedDate: "",
    status: "",
    comments: "",
    customerNumber: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      const ordersData = response.data.data || response.data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Fetch order Error", error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.orderNumber
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          order.status.toLowerCase().includes(search.toLowerCase()) ||
          order.customerNumber
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          order.orderDate.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
    setCurrentPage(1);
  }, [search, orders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (orderNumber) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/orders/${orderNumber}`);
        await fetchOrders();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete order");
      }
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      orderNumber: order.orderNumber.toString(),
      orderDate: order.orderDate || "",
      requiredDate: order.requiredDate || "",
      shippedDate: order.shippedDate || "",
      status: order.status || "",
      comments: order.comments || "",
      customerNumber: order.customerNumber.toString(),
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      orderNumber: "",
      orderDate: "",
      requiredDate: "",
      shippedDate: "",
      status: "",
      comments: "",
      customerNumber: "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        orderNumber: formData.orderNumber.toString(),
        orderDate: formData.orderDate,
        requiredDate: formData.requiredDate,
        shippedDate: formData.shippedDate || "",
        status: formData.status,
        comments: formData.comments || "",
        customerNumber: formData.customerNumber.toString(),
      };

      if (editingOrder) {
        await api.put(`/orders/${editingOrder.orderNumber}`, submitData);
      } else {
        await api.post("/orders", submitData);
      }

      setShowAddModal(false);
      await fetchOrders();
    } catch (error) {
      console.error("Submit failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        error.message;
      alert(
        `Failed to ${editingOrder ? "update" : "add"} order: ${JSON.stringify(
          errorMsg
        )}`
      );
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-1 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Order List</h2>
        <button
          onClick={handleAdd}
          className="transition-colors rounded-lg bg-green-500 text-white hover:bg-green-600 px-4 py-2"
        >
          Add Order
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
            <div className="min-w-max">
              <table className="w-full border text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 whitespace-nowrap">Order ID</th>
                    <th className="border p-2 whitespace-nowrap">Order Date</th>
                    <th className="border p-2 whitespace-nowrap">
                      Required Date
                    </th>
                    <th className="border p-2 whitespace-nowrap">
                      Shipped Date
                    </th>
                    <th className="border p-2 whitespace-nowrap">Status</th>
                    <th className="border p-2 whitespace-nowrap">
                      Customer ID
                    </th>
                    <th className="border p-2 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-gray-50">
                        <td className="border p-2 whitespace-nowrap">
                          {order.orderNumber}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {order.orderDate}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {order.requiredDate}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {order.shippedDate || "N/A"}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                              order.status === "Shipped"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : order.status === "In Process"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "On Hold"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Resolved"
                                ? "bg-purple-100 text-purple-800"
                                : order.status === "Disputed"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {order.customerNumber}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(order)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm whitespace-nowrap"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(order.orderNumber)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm whitespace-nowrap"
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
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingOrder ? "Edit Order" : "Add New Order"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={editingOrder !== null}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Customer Number
                  </label>
                  <input
                    type="number"
                    name="customerNumber"
                    value={formData.customerNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Order Date
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Required Date
                  </label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Shipped Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="shippedDate"
                    value={formData.shippedDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="In Process">In Process</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Disputed">Disputed</option>
                  </select>
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Comments (Optional)
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingOrder ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
