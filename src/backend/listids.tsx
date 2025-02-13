import { createSignal } from "solid-js";

type storageKeys = "listids";

function getAllIds(): string[]{
    const storedIds = localStorage.getItem("listids");
    return storedIds ? JSON.parse(storedIds) : [];
}

const [storedListIds, setStoredListIds] = createSignal<string[]>(getAllIds());

function addListIds(ids: string[]){
    const updatedIds = [...new Set([...storedListIds(), ...ids])];
    setStoredListIds(updatedIds);
    localStorage.setItem("listids", JSON.stringify(updatedIds));
}

function deleteIds(ids: string[]){
    const updatedIds = storedListIds().filter(id => !ids.includes(id));
    setStoredListIds(updatedIds);
    localStorage.setItem("listids", JSON.stringify(updatedIds));
}

function listIdToName(listId: string): string {
    const name = listId.split("-").slice(1).join("-");
    return name;
}

export { storedListIds, addListIds, deleteIds, listIdToName };