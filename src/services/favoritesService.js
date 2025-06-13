import { db } from '@/auth/firebase'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'

const FAVORITES_COLLECTION = 'favorites'

export async function addFavorite(uid, data) {
  return await addDoc(collection(db, FAVORITES_COLLECTION), {
    uid,
    timestamp: Date.now(),
    ...data
  })
}

export async function getFavorites(uid) {
  const q = query(collection(db, FAVORITES_COLLECTION), where('uid', '==', uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function removeFavorite(id) {
  return await deleteDoc(doc(db, FAVORITES_COLLECTION, id))
}
