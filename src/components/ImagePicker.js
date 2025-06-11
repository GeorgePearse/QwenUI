import React, { useState, useEffect } from 'react';

const ImagePicker = ({ onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const imageModules = require.context('@images', false, /\.(png|jpe?g|svg|gif)$/);
    const imageList = imageModules.keys().map(path => ({
      name: path.replace('./', ''),
      path: imageModules(path)
    }));
    setImages(imageList);
  }, []);

  const handleImageSelect = (imagePath) => {
    setSelectedImage(imagePath);
    onImageSelect(imagePath);
  };

  return (
    <div className="image-picker">
      <h3>Select an Image from Local Directory</h3>
      <div className="image-grid">
        {images.map((image) => (
          <div 
            key={image.name} 
            className={`image-item ${selectedImage === image.path ? 'selected' : ''}`}
            onClick={() => handleImageSelect(image.path)}
          >
            <img src={image.path} alt={image.name} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePicker;