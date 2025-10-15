import { User } from "src/schemas/user.schema";

export type SafeUser = Omit<User, 'password' | '_id' | '__v' | 'deleted'>;