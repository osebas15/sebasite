import { createSignal } from "solid-js";

type storageKeys = "listids";

function getAllIds(): string[]{
    const storedIds = localStorage.getItem("listids");
    return storedIds ? JSON.parse(storedIds) : [];
}

const [listIds, setListIds] = createSignal<string[]>(getAllIds());

function addListIds(ids: string[]){
    const updatedIds = [...new Set([...listIds(), ...ids])];
    setListIds(updatedIds);
    localStorage.setItem("listids", JSON.stringify(updatedIds));
}

function deleteIds(ids: string[]){
    const updatedIds = listIds().filter(id => !ids.includes(id));
    setListIds(updatedIds);
    localStorage.setItem("listids", JSON.stringify(updatedIds));
}

export { listIds, addListIds, deleteIds };