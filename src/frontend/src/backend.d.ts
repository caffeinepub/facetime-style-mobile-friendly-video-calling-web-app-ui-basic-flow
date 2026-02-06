import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Peer {
    status: PeerStatus;
    principal: Principal;
    joinedAt?: Time;
    handle: string;
}
export type Time = bigint;
export interface Contact {
    id: Time;
    name: string;
    createdAt: Time;
    handle: string;
}
export interface CallSession {
    id: string;
    creator: Principal;
    createdAt: Time;
    peer?: Peer;
    updatedAt: Time;
    state: CallState;
}
export enum CallState {
    end = "end",
    active = "active",
    pending = "pending"
}
export enum PeerStatus {
    active = "active",
    joined = "joined",
    called = "called",
    hangup = "hangup"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCallSession(): Promise<CallSession>;
    createContact(name: string, handle: string): Promise<Contact>;
    deleteContact(contactId: Time): Promise<void>;
    endCallSession(sessionId: string): Promise<void>;
    getActiveCallSessions(): Promise<Array<CallSession>>;
    getCallSession(sessionId: string): Promise<CallSession>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    joinCallSession(sessionId: string, handle: string): Promise<CallSession>;
    listContacts(): Promise<Array<Contact>>;
}
