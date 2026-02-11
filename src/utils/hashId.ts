import Hashids from "hashids";

const SALT = process.env.HASHIDS_SALT || "qrave_secret_salt_2024";
const MIN_LENGTH = 6;

const hashids = new Hashids(SALT, MIN_LENGTH);

export const HashId = {
  encode: (id: number): string => {
    return hashids.encode(id);
  },
  decode: (hash: string): number | null => {
    const decoded = hashids.decode(hash);

    if (decoded.length === 0) return null;

    return decoded[0] as number;
  },
};
