import User from "../../models/User";
import { BaseRepository } from "../BaseRepository";

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(User);
  }
}
