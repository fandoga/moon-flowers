// // widgets/cart-modal/CartModal.tsx
// "use client";

// import React, { useEffect } from "react";
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { formatPrice } from "@/lib/utils/formatPrice";
// import { useCartStore } from "@/entities/cart/store/cartStore";

// const CartModal = () => {
//   const { data: items } = useCartProducts();
//   const { isCartOpen, closeCart } = useCartStore();

//   useEffect(() => {
//     document.body.style.overflow = isCartOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isCartOpen]);

//   const total = items.reduce(
//     (sum, item: any) => sum + (item.product?.prices?.[0]?.price || 0) * item.quantity,
//     0
//   );

//   return (
//     <AnimatePresence>
//       {isCartOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50"
//             onClick={closeCart}
//           />
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "tween", duration: 0.3 }}
//             className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-5 border-b">
//               <h2 className="text-2xl font-bold text-[#394426] font-manrope">
//                 Ваша заявка
//               </h2>
//               <button
//                 onClick={closeCart}
//                 className="p-2 hover:bg-[#394426] group hover:text-white bg-[#F8F8F8] rounded-sm transition-colors cursor-pointer"
//               >
//                 <X size={28} className="text-[#394426] group-hover:text-white" />
//               </button>
//             </div>

//             <div className="flex-1 p-5 overflow-y-auto">
//               <CartItemsList showTotal={false} />
//             </div>

//             {items.length > 0 && (
//               <div className="p-5 border-t mt-auto">
//                 {/* <div className="flex justify-end gap-3 items-center mb-5">
//                   <span className="text-2xl font-medium">Итого:</span>
//                   <span className="text-2xl font-bold text-[#394426]">
//                     {formatPrice(total)}
//                   </span>
//                 </div> */}
//                 <button
//                   onClick={() => {
//                     window.location.href = "/order";
//                     setTimeout(closeCart, 500);
//                   }}
//                   className="w-full bg-[#394426] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#102902] transition-colors cursor-pointer"
//                 >
//                   Перейти к оформлению
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default CartModal;
