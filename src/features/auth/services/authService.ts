import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/shared/lib/firebase";

const googleProvider = new GoogleAuthProvider();

// 1. Iniciar sesión con Correo y Contraseña
export const loginWithEmail = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// 2. Registrar usuario nuevo (Crea Auth + Documento en Firestore)
export const registerWithEmail = async (email: string, pass: string, name: string, organization: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Actualizar el nombre en el perfil de Auth
  await updateProfile(user, { displayName: name });

  // Crear el documento del usuario en Firestore
  await setDoc(doc(db, "profiles", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: name,
    organization: organization,
    role: "organizador", // Rol por defecto
    createdAt: serverTimestamp(),
  });

  return user;
};

// 3. Iniciar sesión con Google
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Verificar si el usuario ya existe en Firestore, si no, crearlo
  const userDoc = await getDoc(doc(db, "profiles", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "profiles", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Organizador",
      organization: "Por definir",
      role: "organizador",
      createdAt: serverTimestamp(),
    });
  }
  return user;
};

// 4. Cerrar sesión
export const logoutUser = async () => {
  await signOut(auth);
};

// 5. Obtener errores en español para la UI
export const getAuthErrorMessage = (errorCode: string, rawError?: unknown) => {
  if (rawError) console.error("🔥 ERROR DE FIREBASE:", rawError);
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Credenciales incorrectas. Verifica tu correo y contraseña.";
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Intenta iniciar sesión.";
    case "auth/weak-password":
      return "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana de Google antes de completar el inicio de sesión.";
    default:
      return "Ocurrió un error inesperado. Intenta de nuevo.";
  }
};
