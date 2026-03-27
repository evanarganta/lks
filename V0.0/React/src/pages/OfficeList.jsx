import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function OfficeList() {
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOffice, setEditingOffice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    officeCode: "",
    city: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    country: "",
    postalCode: "",
    territory: "",
  });

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await api.get("/office");
      const officesData = response.data.data || response.data || [];
      setOffices(officesData);
      setFilteredOffices(officesData);
    } catch (error) {
      console.error("Fetch Office Error", error);
      setOffices([]);
      setFilteredOffices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOffices(offices);
    } else {
      const filtered = offices.filter(
        (office) =>
          office.officeCode.toLowerCase().includes(search.toLowerCase()) ||
          office.city.toLowerCase().includes(search.toLowerCase()) ||
          office.phone.toLowerCase().includes(search.toLowerCase()) ||
          office.country.toLowerCase().includes(search.toLowerCase()) ||
          office.territory.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOffices(filtered);
    }
    setCurrentPage(1);
  }, [search, offices]);

  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffices = filteredOffices.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (officeCode) => {
    if (confirm("Are you sure you want to delete this office?")) {
      try {
        await api.delete(`/office/${officeCode}`);
        await fetchOffices();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete office");
      }
    }
  };

  const handleEdit = (office) => {
    setEditingOffice(office);
    setFormData({
      officeCode: office.officeCode,
      city: office.city,
      phone: office.phone,
      addressLine1: office.addressLine1,
      addressLine2: office.addressLine2 || "",
      state: office.state || "",
      country: office.country,
      postalCode: office.postalCode,
      territory: office.territory,
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingOffice(null);
    setFormData({
      officeCode: "",
      city: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      country: "",
      postalCode: "",
      territory: "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffice) {
        await api.put(`/office/${editingOffice.officeCode}`, formData);
      } else {
        await api.post("/office", formData);
      }
      setShowAddModal(false);
      await fetchOffices();
    } catch (error) {
      console.error("Submit failed:", error);
      alert(`Failed to ${editingOffice ? "update" : "add"} office`);
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
        <h2 className="text-2xl font-semibold">Office List</h2>
        <button
          onClick={handleAdd}
          className="transition-colors rounded-lg bg-green-500 text-white hover:bg-green-600 px-4 py-2"
        >
          Add Office
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search office..."
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
                  <th className="border p-2">City</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Address Line</th>
                  <th className="border p-2">Second Address Line</th>
                  <th className="border p-2">Country</th>
                  <th className="border p-2">Postal Code</th>
                  <th className="border p-2">Territory</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOffices.length > 0 ? (
                  currentOffices.map((office) => (
                    <tr key={office.officeCode} className="hover:bg-gray-50">
                      <td className="border p-2">{office.officeCode}</td>
                      <td className="border p-2">{office.city}</td>
                      <td className="border p-2">{office.phone}</td>
                      <td className="border p-2">{office.addressLine1}</td>
                      <td className="border p-2">
                        {office.addressLine2 || "N/A"}
                      </td>
                      <td className="border p-2">{office.country}</td>
                      <td className="border p-2">{office.postalCode}</td>
                      <td className="border p-2">{office.territory}</td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(office)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(office.officeCode)}
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
                      colSpan="9"
                      className="border p-4 text-center text-gray-500"
                    >
                      No offices found
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
              {editingOffice ? "Edit Office" : "Add New Office"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Office Code
                  </label>
                  <input
                    type="text"
                    name="officeCode"
                    value={formData.officeCode}
                    onChange={handleInputChange}
                    required
                    disabled={editingOffice !== null}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Territory
                  </label>
                  <input
                    type="text"
                    name="territory"
                    value={formData.territory}
                    onChange={handleInputChange}
                    required
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
                  {editingOffice ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
