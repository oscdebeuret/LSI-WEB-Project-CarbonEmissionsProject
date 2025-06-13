import { db } from '@/auth/firebase'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const FAVORITES_COLLECTION = 'favorites'

export async function addOrUpdateFavorite(uid, data) {
  const favoritesRef = collection(db, FAVORITES_COLLECTION)

  const q = query(
    favoritesRef,
    where('uid', '==', uid),
    where('activityType', '==', data.activityType),
    where('region', '==', data.region)
  )

  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    // On met à jour le premier document trouvé
    const existingDoc = snapshot.docs[0]
    await updateDoc(doc(db, FAVORITES_COLLECTION, existingDoc.id), {
      ...data,
      timestamp: Date.now()
    })
    return { updated: true, id: existingDoc.id }
  } else {
    const newDoc = await addDoc(favoritesRef, {
      uid,
      ...data,
      timestamp: Date.now()
    })
    return { created: true, id: newDoc.id }
  }
}

export async function getFavorites(uid) {
  try {
    const q = query(collection(db, FAVORITES_COLLECTION), where('uid', '==', uid))
    const snapshot = await getDocs(q)
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Firestore : données récupérées pour', uid, result)
    return result
  } catch (e) {
    console.error('Erreur Firestore dans getFavorites:', e)
  }
}

export async function removeFavorite(id) {
  return await deleteDoc(doc(db, FAVORITES_COLLECTION, id))
}
