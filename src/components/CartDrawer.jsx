import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CartDrawer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    clearCart,
    showCartDrawer,
    setShowCartDrawer,
  } = useCart();

  if (!showCartDrawer) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer animate-fadeIn"
        onClick={() => setShowCartDrawer(false)}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300 translate-x-0">
          {/* Header */}
          <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <FaShoppingCart className="text-[#0C8CE9] text-xl animate-pulse" />
              <h2 className="text-lg font-bold text-slate-800">Shopping Cart</h2>
              <span className="bg-blue-100 text-[#0C8CE9] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setShowCartDrawer(false)}
              className="text-slate-400 hover:text-red-500 p-1 hover:bg-slate-100 rounded-full transition-all"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
                  <FaShoppingCart size={32} className="text-slate-300" />
                </div>
                <p className="font-bold text-slate-600 text-sm">Your cart is empty</p>
                <p className="text-xs font-medium text-slate-400 max-w-xs leading-relaxed">
                  Add medicines from the Pharmacy page to get started.
                </p>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    navigate("/pharmacy");
                  }}
                  className="mt-3 bg-blue-50 text-[#0C8CE9] font-bold py-2 px-5 rounded-xl text-xs hover:bg-[#0C8CE9] hover:text-white transition-all"
                >
                  Go to Pharmacy
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                if (!item || !item.medicine) return null;
                return (
                  <div
                    key={item.medicine._id}
                    className="flex items-center justify-between border-b pb-4 gap-4"
                  >
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      className="w-16 h-16 object-cover rounded-xl border bg-slate-50 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">
                        {item.medicine.name}
                      </h4>
                      <p className="text-xs text-[#0C8CE9] font-bold mt-0.5">
                        {item.medicine.generic}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity control */}
                        <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>
                        {/* Price */}
                        <span className="text-sm font-bold text-slate-800">
                          ৳ {item.medicine.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.medicine._id)}
                      className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all shrink-0"
                      title="Remove"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 bg-slate-50 space-y-4">
              <div className="flex justify-between text-base font-bold text-slate-800">
                <span>Total Amount</span>
                <span className="text-blue-600 text-lg font-black">৳ {cartTotal}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                * Orders with prescription-only medicines will require a valid prescription upload. Delivery charges and taxes calculated at checkout.
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    Swal.fire({
                      icon: "warning",
                      title: "Login Required",
                      text: "Please login to proceed with placing your order.",
                      confirmButtonColor: "#0C8CE9"
                    });
                    setShowCartDrawer(false);
                    navigate("/login");
                    return;
                  }

                  Swal.fire({
                    icon: "success",
                    title: "Order Placed Successfully",
                    text: `Thank you for your order! Your total of ৳ ${cartTotal} will be collected at your doorstep (Cash on Delivery).`,
                    confirmButtonColor: "#0C8CE9"
                  });
                  clearCart();
                  setShowCartDrawer(false);
                }}
                className="w-full bg-[#0C8CE9] hover:bg-blue-600 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/10 active:scale-[0.98]"
              >
                Place Order (Cash on Delivery)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
