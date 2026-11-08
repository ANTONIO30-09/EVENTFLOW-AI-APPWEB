"use client";

import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  containerClassName?: string;
}

export default function OptimizedImage({ containerClassName, className, alt, ...props }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName || ""}`}>
      <motion.div
        initial={{ opacity: 0, filter: "blur(15px)", scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          filter: isLoaded ? "blur(0px)" : "blur(15px)",
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        <Image
          {...props}
          alt={alt}
          className={className}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
