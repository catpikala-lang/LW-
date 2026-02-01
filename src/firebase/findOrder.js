import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * অর্ডার আইডি (orderNumber) এবং ফোন নম্বর দিয়ে ডাটাবেস থেকে অর্ডার খুঁজে বের করা
 */
export const findOrderByOrderIdAndPhone = async (orderId, phone) => {
  try {
    // ১. প্রথমে 'orderNumber' দিয়ে সার্চ করুন
    const q = query(
      collection(db, "orders"),
      where("orderNumber", "==", orderId)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    // ২. প্রাপ্ত রেজাল্ট থেকে ফোন নম্বর চেক করুন (যা ডাটাবেসে customer.phone হিসেবে আছে)
    const docSnap = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return data.customer && data.customer.phone === phone;
    });

    if (!docSnap) return null;

    // ৩. আইডি সহ সম্পূর্ণ ডাটা রিটার্ন করা
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("অর্ডার খুঁজতে সমস্যা: ", error);
    return null;
  }
};