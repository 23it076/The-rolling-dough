import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  getBookings, updateBookingStatus, deleteBooking,
  getMenu, addMenuItem, deleteMenuItem,
  getGallery, addGalleryItem, deleteGalleryItem,
  getReviews, addReviewItem, deleteReviewItem
} from "../firebase/services";
import { 
  Calendar, Pizza, Image as ImageIcon, Star, LogOut, Plus, Trash2, CheckCircle, Clock, XCircle, Search, Download, BarChart2
} from "lucide-react";

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bookings");

  // Data states
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form entries
  const [newMenu, setNewMenu] = useState({ name: "", description: "", ingredients: "", price: "Premium Package", category: "Classic", image: "", isPopular: false });
  const [newGallery, setNewGallery] = useState({ title: "", category: "Pizza", image: "" });
  const [newReview, setNewReview] = useState({ customerName: "", company: "", review: "", rating: 5, photo: "" });

  useEffect(() => {
    if (!currentUser) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    const b = await getBookings();
    const m = await getMenu();
    const g = await getGallery();
    const r = await getReviews();
    setBookings(b);
    setMenu(m);
    setGallery(g);
    setReviews(r);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // CSV Export for Bookings
  const exportBookingsToCSV = () => {
    if (bookings.length === 0) return;
    const headers = ["Reference ID", "Name", "Phone", "Email", "City", "Event Date", "Guests", "Type", "Status"];
    const rows = bookings.map(b => [
      b.referenceId || b.id,
      `"${b.name || ""}"`,
      `"${b.phone || ""}"`,
      `"${b.email || ""}"`,
      `"${b.city || ""}"`,
      `"${b.eventDate || ""}"`,
      b.guestCount || 0,
      `"${b.eventType || ""}"`,
      b.status || "pending"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rolling_Dough_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Booking filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.city && b.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.phone && b.phone.includes(searchTerm));
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Actions
  const handleStatusChange = async (id, status) => {
    await updateBookingStatus(id, status);
    fetchData();
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking entry?")) {
      await deleteBooking(id);
      fetchData();
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    await addMenuItem(newMenu);
    setShowMenuModal(false);
    setNewMenu({ name: "", description: "", ingredients: "", price: "Premium Package", category: "Classic", image: "", isPopular: false });
    fetchData();
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm("Delete this menu item?")) {
      await deleteMenuItem(id);
      fetchData();
    }
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    await addGalleryItem(newGallery);
    setShowGalleryModal(false);
    setNewGallery({ title: "", category: "Pizza", image: "" });
    fetchData();
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm("Delete gallery photo?")) {
      await deleteGalleryItem(id);
      fetchData();
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    await addReviewItem(newReview);
    setShowReviewModal(false);
    setNewReview({ customerName: "", company: "", review: "", rating: 5, photo: "" });
    fetchData();
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Delete review?")) {
      await deleteReviewItem(id);
      fetchData();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-pizzaDark text-white flex flex-col md:flex-row font-inter">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-10">
            <span className="font-playfair font-bold text-xl tracking-wider text-white uppercase block">
              Rolling <span className="text-pizzaOrange">Admin</span>
            </span>
            <span className="text-[10px] text-white/50 font-poppins uppercase tracking-widest block mt-1">Management Portal</span>
          </div>

          <nav className="space-y-2 font-poppins text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "bookings" ? "bg-pizzaOrange text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <Calendar size={16} />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "menu" ? "bg-pizzaOrange text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <Pizza size={16} />
              <span>Menu ({menu.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "gallery" ? "bg-pizzaOrange text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <ImageIcon size={16} />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "reviews" ? "bg-pizzaOrange text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <Star size={16} />
              <span>Reviews ({reviews.length})</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="text-xs text-white/60">
            <p className="font-semibold">{currentUser.name || "Admin User"}</p>
            <p className="text-[10px] text-white/40 truncate">{currentUser.email}</p>
          </div>

          <Link to="/" className="text-xs font-poppins text-white/60 hover:text-pizzaOrange transition-colors">← Back to Main Site</Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-poppins font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold">Event Bookings & Inquiries</h1>
                <p className="text-xs text-white/60 font-poppins uppercase tracking-wider mt-1">Real-time management dashboard</p>
              </div>

              <button
                onClick={exportBookingsToCSV}
                className="px-4 py-2.5 bg-pizzaGold hover:bg-pizzaOrange text-pizzaDark hover:text-white font-poppins text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1A1A1A] p-6 border border-white/10">
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-white/50 block mb-1">Total Inquiries</span>
                <span className="font-playfair text-4xl font-bold text-pizzaOrange">{bookings.length}</span>
              </div>
              <div className="bg-[#1A1A1A] p-6 border border-white/10">
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-white/50 block mb-1">Confirmed Events</span>
                <span className="font-playfair text-4xl font-bold text-green-400">{bookings.filter(b => b.status === "confirmed").length}</span>
              </div>
              <div className="bg-[#1A1A1A] p-6 border border-white/10">
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-white/50 block mb-1">Pending Review</span>
                <span className="font-playfair text-4xl font-bold text-pizzaGold">{bookings.filter(b => !b.status || b.status === "pending").length}</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by client name, city or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-sm text-white pl-10 focus:outline-none focus:border-pizzaOrange"
                />
                <Search size={16} className="absolute left-3 top-3 text-white/40" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pizzaOrange"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-[#1A1A1A] border border-white/10 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#222222] border-b border-white/10 text-xs font-poppins uppercase tracking-wider text-white/60">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-light">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-xs text-pizzaGold">{b.referenceId || b.id.slice(0, 8)}</td>
                      <td className="p-4">
                        <p className="font-semibold text-white">{b.name}</p>
                        <p className="text-xs text-white/50">{b.phone} | {b.email}</p>
                      </td>
                      <td className="p-4">{b.city}</td>
                      <td className="p-4 font-mono text-xs">{b.eventDate}</td>
                      <td className="p-4 font-semibold text-pizzaOrange">{b.guestCount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-poppins uppercase tracking-widest ${
                          b.status === "confirmed" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                          b.status === "cancelled" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}>
                          {b.status || "pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusChange(b.id, "confirmed")} title="Confirm" className="p-1.5 text-green-400 hover:bg-green-400/10">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => handleStatusChange(b.id, "cancelled")} title="Cancel" className="p-1.5 text-yellow-400 hover:bg-yellow-400/10">
                            <XCircle size={16} />
                          </button>
                          <button onClick={() => handleDeleteBooking(b.id)} title="Delete" className="p-1.5 text-red-400 hover:bg-red-400/10">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-white/50 font-light">No matching booking records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold">Pizza Menu CRUD</h1>
                <p className="text-xs text-white/60 font-poppins uppercase tracking-wider mt-1">Add, edit or delete wood-fired pizza items</p>
              </div>
              <button
                onClick={() => setShowMenuModal(true)}
                className="px-4 py-2 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Pizza</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map((item) => (
                <div key={item.id} className="bg-[#1A1A1A] border border-white/10 p-4 flex gap-4 relative group">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] text-pizzaGold font-poppins uppercase tracking-widest">{item.category}</span>
                    <h3 className="font-playfair font-bold text-lg">{item.name}</h3>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1">{item.ingredients}</p>
                    <p className="text-xs text-pizzaOrange font-semibold mt-2">{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMenu(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold">Gallery Management</h1>
                <p className="text-xs text-white/60 font-poppins uppercase tracking-wider mt-1">Upload and manage live pizza photography</p>
              </div>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="px-4 py-2 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative aspect-square overflow-hidden group bg-[#1A1A1A] border border-white/10">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-pizzaGold font-poppins uppercase tracking-widest">{g.category}</span>
                      <p className="font-playfair font-bold text-sm text-white">{g.title}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="self-end p-2 bg-red-500 text-white rounded-none"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold">Reviews & Testimonials</h1>
                <p className="text-xs text-white/60 font-poppins uppercase tracking-wider mt-1">Manage guest feedback showcase</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-[#1A1A1A] border border-white/10 p-6 relative group">
                  <div className="flex gap-1 text-pizzaGold mb-3">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-white/80 italic mb-4">"{r.review}"</p>
                  <div>
                    <h4 className="font-playfair font-bold">{r.customerName}</h4>
                    <p className="text-xs text-pizzaOrange">{r.company}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="absolute top-4 right-4 p-1.5 text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Add Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] border border-white/10 p-8 max-w-md w-full">
            <h2 className="font-playfair text-2xl font-bold mb-6">Add New Pizza</h2>
            <form onSubmit={handleAddMenu} className="space-y-4">
              <input type="text" placeholder="Pizza Name" required value={newMenu.name} onChange={e => setNewMenu({...newMenu, name: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <input type="text" placeholder="Category (Classic, Premium, Vegetarian, Special)" required value={newMenu.category} onChange={e => setNewMenu({...newMenu, category: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <textarea placeholder="Ingredients list" required value={newMenu.ingredients} onChange={e => setNewMenu({...newMenu, ingredients: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <input type="text" placeholder="Image URL" required value={newMenu.image} onChange={e => setNewMenu({...newMenu, image: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3 bg-pizzaOrange text-white font-poppins text-xs font-semibold uppercase">Save</button>
                <button type="button" onClick={() => setShowMenuModal(false)} className="flex-1 py-3 border border-white/20 text-white font-poppins text-xs font-semibold uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] border border-white/10 p-8 max-w-md w-full">
            <h2 className="font-playfair text-2xl font-bold mb-6">Add Gallery Image</h2>
            <form onSubmit={handleAddGallery} className="space-y-4">
              <input type="text" placeholder="Photo Title" required value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <input type="text" placeholder="Category (Oven, Pizza, Chef)" required value={newGallery.category} onChange={e => setNewGallery({...newGallery, category: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <input type="text" placeholder="Image URL" required value={newGallery.image} onChange={e => setNewGallery({...newGallery, image: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3 bg-pizzaOrange text-white font-poppins text-xs font-semibold uppercase">Save</button>
                <button type="button" onClick={() => setShowGalleryModal(false)} className="flex-1 py-3 border border-white/20 text-white font-poppins text-xs font-semibold uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] border border-white/10 p-8 max-w-md w-full">
            <h2 className="font-playfair text-2xl font-bold mb-6">Add Review</h2>
            <form onSubmit={handleAddReview} className="space-y-4">
              <input type="text" placeholder="Customer Name" required value={newReview.customerName} onChange={e => setNewReview({...newReview, customerName: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <input type="text" placeholder="Company/Event" required value={newReview.company} onChange={e => setNewReview({...newReview, company: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <textarea placeholder="Review text" required value={newReview.review} onChange={e => setNewReview({...newReview, review: e.target.value})} className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3 bg-pizzaOrange text-white font-poppins text-xs font-semibold uppercase">Save</button>
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-3 border border-white/20 text-white font-poppins text-xs font-semibold uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
