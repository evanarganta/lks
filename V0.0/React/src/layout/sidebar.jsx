import { Link, useLocation } from "react-router-dom";

export default function sidebar() {
const {pathname} = useLocation();
const navLink = (to, label) => (
    <Link
        to={to}
        className={`block px-2.5 py-4 rounded-md transition ${
            pathname === to
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-blue-100"
        }`}>
        {label}
    </Link> );
    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-4">
            <Link to="/" className="block">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Atmint Panel</h2>
            </Link>
            <nav className="space-y-2">
                {navLink("/office", "Office")}
                {navLink("/employees", "Employee")}
                {navLink("/customers", "Customer")}
                {navLink("/payments", "Payment")}
                {navLink("/products", "Product")}
                {navLink("/productlines", "Product Line")}
                {navLink("/orders", "Order")}
                {navLink("/orderdetails", "Order Details")}
            </nav>
        </div>
    );
};