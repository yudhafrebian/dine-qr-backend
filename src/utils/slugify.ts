export default function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove non-word, non-whitespace, non-hyphen characters
        .replace(/[\s_-]+/g, "-") // replace whitespace and underscore with hyphens
        .replace(/^-+/, "") // trim leading hyphens
        .replace(/-+$/, ""); // trim trailing hyphens
}