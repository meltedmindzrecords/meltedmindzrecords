/** Shared A–Z helpers for the artists page and its letter bar. */

export const LETTERS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];

/** The element id for a letter's group: letter-A … letter-Z, letter-0-9 for "#". */
export function letterId(letter: string) {
  return letter === "#" ? "letter-0-9" : `letter-${letter}`;
}

/** The group a name files under: its first letter (accents ignored), or "#" for a digit or symbol. */
export function letterFor(name: string) {
  const first = name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
}
