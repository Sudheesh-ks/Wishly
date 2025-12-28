import Admin from "../../models/Admin";
import { BaseRepository } from "../BaseRepository";

export class AdminRepository extends BaseRepository<any> {
  constructor() {
    super(Admin);
  }
}
