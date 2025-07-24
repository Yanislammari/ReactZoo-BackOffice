import UserJob from "./UserJob";
import UserRole from "./UserRole";
import Zoo from "./Zoo";

interface User {
  _id: string;
  role: UserRole;
  jobs: UserJob[];
  lastName: string;
  firstName: string;
  login: string;
  password: string;
  email: string;
  zoo?: Zoo;
}

export default User;
