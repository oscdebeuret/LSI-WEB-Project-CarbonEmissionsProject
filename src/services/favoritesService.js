import { db } from '@/auth/firebase'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'

const FAVORITES_COLLECTION = 'favorites'

export async function addOrUpdateFavorite(uid, data) {
  const favoritesRef = collection(db, FAVORITES_COLLECTION)

  const filters = [
    where('uid', '==', uid),
    where('activityType', '==', data.activityType)
  ]

  // Ajout conditionnel des critères spécifiques selon le type d'activité
  if (data.activityType === 'CPU (vCPU)' || data.activityType === 'RAM (GB)') {
    if (data.region) filters.push(where('region', '==', data.region))
    if (data.provider) filters.push(where('provider', '==', data.provider))
  }

  if (data.activityType === 'Electricité') {
    if (data.region) filters.push(where('region', '==', data.region))
  }

  if (data.activityType === 'Vol') {
    if (data.origin) filters.push(where('origin', '==', data.origin))
    if (data.destination) filters.push(where('destination', '==', data.destination))
  }

  const q = query(favoritesRef, ...filters)

  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
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
