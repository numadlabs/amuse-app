import type { ColumnType } from "kysely";
import type { ROLES, TIER } from "./enums";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type User = {
  id: Generated<string>;
  email: string | null;
  emailVerificationCode: string | null;
  isEmailVerified: Generated<boolean>;
  emailVerifiedAt: Timestamp | null;
  password: string;
  nickname: string;
  firstName: string | null;
  lastName: string | null;
  role: Generated<ROLES>;
  prefix: string;
  telNumber: string;
  telVerificationCode: string | null;
  isTelVerified: Generated<boolean>;
  profilePicture: string | null;
  dateOfBirth: Timestamp | null;
  location: string | null;
  createdAt: Generated<Timestamp>;
};
