import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";

// Map property types to images for variety
const imagesByType: Record<string, string[]> = {
  Apartment: [property1, property3, property5],
  Villa: [property2, property3, property1],
  PG: [property4, property5, property3],
  Studio: [property5, property3, property1],
  "Independent House": [property2, property1, property3],
};

export const getPropertyImages = (propertyType: string, index: number = 0): string[] => {
  const base = imagesByType[propertyType] || imagesByType["Apartment"];
  // Return 4-5 images by cycling through available images
  return [
    base[0],
    base[1],
    base[2],
    base[(index % 3)],
    base[((index + 1) % 3)],
  ];
};

export const getPropertyThumbnail = (propertyType: string): string => {
  const images = imagesByType[propertyType] || imagesByType["Apartment"];
  return images[0];
};
