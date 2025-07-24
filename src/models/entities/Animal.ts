import Space from "./Space";

interface Animal {
  _id: string;
  name: string;
  description: string;
  images: string[];
  species: string;
  space: Space | string;
  bornOn: string;
}

export default Animal; 
