import React, { useState, useEffect } from "react";
import { uploadToImgBB } from "../api/imgbb";
import { getBannerImages, addBannerImage, removeBannerImage } from "../firebase/firestoreFunctions";

export default function AdminBannerManager() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]); // কোন ছবি স্লাইডারে দেখাবেন

  useEffect(() => {
    getBannerImages().then((imgs) => {
      setImages(imgs);
      // প্রথমবার সব ছবি সিলেক্টেড দেখাবে
      setSelected(imgs);
    });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("ফাইল সিলেক্ট করুন");
    setUploading(true);
    setError("");
    try {
      const res = await uploadToImgBB(file);
      if (res && res.data && res.data.url) {
        await addBannerImage(res.data.url);
      } else {
        throw new Error("imgbb upload failed");
      }
      const imgs = await getBannerImages();
      setImages(imgs);
      setSelected(imgs);
      setFile(null);
    } catch (err) {
      setError("আপলোডে সমস্যা হয়েছে");
    }
    setUploading(false);
  };

  const handleRemove = async (url) => {
    await removeBannerImage(url);
    const imgs = await getBannerImages();
    setImages(imgs);
    setSelected(selected.filter((img) => img !== url));
  };

  // স্লাইডারে দেখানোর জন্য টগল
  const handleToggle = (url) => {
    if (selected.includes(url)) {
      setSelected(selected.filter((img) => img !== url));
    } else {
      setSelected([...selected, url]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Banner Images Manager</h2>
      <div className="mb-4 flex gap-2 items-center">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img} className="relative group border rounded p-1">
            <img src={img} alt="banner" className="rounded w-full h-32 object-cover mb-2" />
            <div className="flex justify-between items-center">
              <button
                className="bg-red-600 text-white rounded px-2 py-1 text-xs opacity-80 hover:opacity-100"
                onClick={() => handleRemove(img)}
              >
                Remove
              </button>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(img)}
                  onChange={() => handleToggle(img)}
                />
                <span className="text-xs">Show in Banner</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">যে ছবিগুলো টিক চিহ্ন দেয়া থাকবে, শুধু সেগুলো হোমপেজের ব্যানারে দেখাবে।</div>
    </div>
  );
}
