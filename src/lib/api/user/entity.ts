import { RegistrationEntity } from "../registration/entity";

export interface UserEntity {
	id: string;
	firstName: string;
	lastName: string;
	gender: string;
	shirtSize: string;
	dietaryRestriction?: string;
	allergies?: string;
	university: string;
	email: string;
	major: string;
	phone: string;
	country: string;
	race?: string;
	resume?: string;
	linkedinUrl?: string;
}

export interface UserCreateEntity extends Omit<UserEntity, "id" | "resume"> {
	resume?: File;
}

/**
 * GET /users/info/me. `registration` is null when the user hasn't registered
 * for the active hackathon, and the whole body is `{}` when the signed-in
 * account has no user profile at all.
 */
export type UserInfoMe =
	| (UserEntity & { registration: RegistrationEntity | null })
	| { [K in keyof UserEntity | "registration"]?: undefined };

export interface ExtraCreditClass {
	id: number;
	name: string;
	hackathonId: string | null;
}

export interface ExtraCreditAssignment {
	userId: string;
	classId: number;
}
