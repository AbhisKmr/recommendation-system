import React, { useState } from "react";

const ImageWithFallback = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={300}
      height={450}
      onError={() => {
        setImgSrc(
          "https://davidkoepp.com/wp-content/themes/blankslate/images/Movie%20Placeholder.jpg"
        );
      }}
    />
  );
};

export default ImageWithFallback;
