import { type } from "os";

export type Address = {
    id: number;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
}