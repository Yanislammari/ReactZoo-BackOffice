import SpaceAccessibility from "./SpaceAccessibility";
import SpaceType from "./SpaceType";
import Zoo from "./Zoo";

interface Space {
  _id: string;
  zoo: Zoo;
  name: string;
  description: string;
  images: string[];
  types: SpaceType[];
  capacity: number;
  visitorDuration: number;
  openingHours: number; // 10h25 -> 60*10 + 25
  closingHours: number; // 17h25 -> 60*17 + 25
  accessibility: SpaceAccessibility[];
  disabled: boolean;
}

export default Space;
