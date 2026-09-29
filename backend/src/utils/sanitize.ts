export function toSafeUser(userDoc: any) {
    const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
    const { passwordHash, __v, ...safe } = obj;
    return { ...safe, id: obj._id.toString() };
}
