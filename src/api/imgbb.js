// শুধু এই functionটা copy-paste করো
export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', '3922eca601ef2003c66d07dfff4c3f60'); // এখানে তোমার API key দাও
  
  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });
  return await response.json();
};

export const uploadMultipleImages = async (files) => {
  const uploadPromises = files.map(file => uploadToImgBB(file));
  const results = await Promise.all(uploadPromises);

  const successfulUploads = results.filter(r => r.success !== false && r.data && r.data.url);
  const failedUploads = results.filter(r => r.success === false || !r.data || !r.data.url);

  return {
    success: successfulUploads.length > 0,
    images: successfulUploads.map(img => img.data.url),
    thumbnails: successfulUploads.map(img => img.data.thumb?.url || img.data.url),
    errors: failedUploads.map(img => img.error || (img.data && img.data.error && img.data.error.message))
  };
};
