// ========== Banner Images Functions ===========
const BANNER_COLLECTION = "bannerImages";

// সব ব্যানার ইমেজ লোড
export const getBannerImages = async () => {
  try {
    const q = query(collection(db, BANNER_COLLECTION));
    const querySnapshot = await getDocs(q);
    const images = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.url) images.push(data.url);
    });
    return images;
  } catch (error) {
    console.error("ব্যানার ইমেজ লোড করতে সমস্যা: ", error);
    return [];
  }
};

// নতুন ব্যানার ইমেজ যোগ
export const addBannerImage = async (url) => {
  try {
    await addDoc(collection(db, BANNER_COLLECTION), { url, createdAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error("ব্যানার ইমেজ যোগ করতে সমস্যা: ", error);
    return false;
  }
};

// ব্যানার ইমেজ রিমুভ
export const removeBannerImage = async (url) => {
  try {
    const q = query(collection(db, BANNER_COLLECTION), where("url", "==", url));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  } catch (error) {
    console.error("ব্যানার ইমেজ ডিলিট করতে সমস্যা: ", error);
    return false;
  }
};
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// কালেকশন এর নামগুলো
const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";

// ========== অর্ডার ফাংশন (ORDERS FUNCTIONS) ==========

/**
 * নতুন অর্ডার সেভ করার জন্য
 */
export const saveOrder = async (orderData) => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "pending",
      trackingLink: orderData.trackingLink || '#',
    };
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithTimestamp);
    console.log("অর্ডার সেভ হয়েছে, আইডি: ", docRef.id);
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("অর্ডার সেভ করতে সমস্যা: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * সব অর্ডার দেখার জন্য (অ্যাডমিন প্যানেলের জন্য)
 * Updated with Timestamp conversion logic
 */
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({ 
        id: doc.id, 
        ...data,
        // Firebase timestamp কে JavaScript Date এ কনভার্ট করা হয়েছে
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null
      });
    });
    
    console.log("Loaded orders from Firebase:", orders.length);
    return { success: true, orders };
  } catch (error) {
    console.error("অর্ডার লিস্ট পেতে সমস্যা: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * ফোন নম্বর দিয়ে অর্ডার লিস্ট আনার ফাংশন
 */
export const getOrdersByPhone = async (phone) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("customer.phone", "==", phone),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null
      });
    });
    return { success: true, orders };
  } catch (error) {
    console.error("ফোন নম্বর দ্বারা অর্ডার লোড করতে সমস্যা: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * অর্ডার স্ট্যাটাস আপডেট করার জন্য
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা:', error);
    return { success: false, error: error.message };
  }
};

// ========== পণ্য ফাংশন (PRODUCTS FUNCTIONS) ==========

/**
 * নতুন পণ্য যোগ করার জন্য
 */
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return { success: true, productId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * সব পণ্য ডাটাবেজ থেকে আনার জন্য
 */
export const getAllProducts = async () => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null
      });
    });
    
    console.log("Loaded products from Firebase:", products.length);
    return { success: true, products };
  } catch (error) {
    console.error("পণ্য লোড করতে সমস্যা: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * পণ্য আপডেট করার জন্য
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('পণ্য আপডেট করতে সমস্যা:', error);
    return { success: false, error: error.message };
  }
};

/**
 * পণ্য ডিলিট করার জন্য
 */
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Toggle featured status
export const toggleFeatured = async (productId, currentStatus) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      featured: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== ইউটিলিটি ফাংশন (UTILITY) ==========

/**
 * অটোমেটিক অর্ডার নাম্বার তৈরি করার জন্য
 */
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `LW${timestamp.slice(-6)}${random}`;
};

/**
 * ফিল্টারিং ফাংশন (ভবিষ্যতের জন্য)
 */
export const getOrdersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null
      });
    });
    return { success: true, orders };
  } catch (error) {
    console.error("স্ট্যাটাস দ্বারা অর্ডার লোড করতে সমস্যা: ", error);
    return { success: false, error: error.message };
  }
};