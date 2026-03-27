export default function Topbar(){
    return(
        <div className="sticky top-0 bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-700">Selamat Datang, itu tombol login pajangan doanh</h1>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Sign In
                </button>
                <button className="px-4 py-2 bg-blue-100 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                    Logkn
                </button>
            </div>
        </div>
    );
}