import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    employeeNumber: "",
    lastName: "",
    firstName: "",
    extension: "",
    email: "",
    officeCode: "",
    reportsTo: "",
    jobTitle: "",
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employees");
      const employeesData = response.data.data || response.data || [];
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error("Fetch Employees Error", error);
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.employeeNumber
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
          employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
          employee.email.toLowerCase().includes(search.toLowerCase()) ||
          employee.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
          employee.officeCode.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
    setCurrentPage(1);
  }, [search, employees]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (employeeNumber) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${employeeNumber}`);
        await fetchEmployees();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeNumber: employee.employeeNumber,
      lastName: employee.lastName,
      firstName: employee.firstName,
      extension: employee.extension,
      email: employee.email,
      officeCode: employee.officeCode,
      reportsTo: employee.reportsTo || "",
      jobTitle: employee.jobTitle,
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      employeeNumber: "",
      lastName: "",
      firstName: "",
      extension: "",
      email: "",
      officeCode: "",
      reportsTo: "",
      jobTitle: "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.employeeNumber}`, formData);
      } else {
        await api.post("/employees", formData);
      }
      setShowAddModal(false);
      await fetchEmployees();
    } catch (error) {
      console.error("Submit failed:", error);
      alert(`Failed to ${editingEmployee ? "update" : "add"} employee`);
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
        <h2 className="text-2xl font-semibold">Employees List</h2>
        <button
          onClick={handleAdd}
          className="transition-colors rounded-lg bg-green-500 text-white hover:bg-green-600 px-4 py-2"
        >
          Add Employee
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee..."
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
                  <th className="border p-2">Last Name</th>
                  <th className="border p-2">First Name</th>
                  <th className="border p-2">Extension</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Office Code</th>
                  <th className="border p-2">Reports To</th>
                  <th className="border p-2">Job Title</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee) => (
                    <tr
                      key={employee.employeeNumber}
                      className="hover:bg-gray-50"
                    >
                      <td className="border p-2">{employee.employeeNumber}</td>
                      <td className="border p-2">{employee.lastName}</td>
                      <td className="border p-2">{employee.firstName}</td>
                      <td className="border p-2">{employee.extension}</td>
                      <td className="border p-2">{employee.email}</td>
                      <td className="border p-2">{employee.officeCode}</td>
                      <td className="border p-2">
                        {employee.reportsTo || "N/A"}
                      </td>
                      <td className="border p-2">{employee.jobTitle}</td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(employee.employeeNumber)
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
                      colSpan="9"
                      className="border p-4 text-center text-gray-500"
                    >
                      No employees found
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
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Employee Number
                  </label>
                  <input
                    type="number"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    required
                    disabled={editingEmployee !== null}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Extension
                  </label>
                  <input
                    type="text"
                    name="extension"
                    value={formData.extension}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Reports To (Employee Number)
                  </label>
                  <input
                    type="number"
                    name="reportsTo"
                    value={formData.reportsTo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
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
                  {editingEmployee ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
