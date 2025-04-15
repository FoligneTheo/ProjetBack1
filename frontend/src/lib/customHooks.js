import { useState, useEffect } from 'react';
import { getAuthenticatedUser, getBestRatedBooks } from './common';

// eslint-disable-next-line import/prefer-default-export
export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuth(authenticated);
      setUserLoading(false);
    }
    getUserDetails();
  }, []);

  return { connectedUser, auth, userLoading };
}

export function useBestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState([]);

  useEffect(() => {
    async function getRatedBooks() {
      const books = await getBestRatedBooks();

      // Vérification des données reçues
      console.log("📊 Livres récupérés avant tri :", books);

      // Transformation : `_id` → `id`
      const formattedBooks = books.map(book => ({ ...book, id: book._id }));

      // Tri des livres par `averageRating` (du plus grand au plus petit)
      const sortedBooks = formattedBooks.sort((a, b) => b.averageRating - a.averageRating);

      // On garde seulement les 3 meilleurs
      const topBooks = sortedBooks.slice(0, 3);

      console.log("🏆 Top 3 livres les mieux notés :", topBooks);

      setBestRatedBooks(topBooks);
    }
    getRatedBooks();
  }, []);

  return { bestRatedBooks };
}


export function useFilePreview(file) {
  const fileInput = file[0] ?? [];
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (file && file[0]?.length > 0) {
      const newUrl = URL.createObjectURL(file[0][0]);

      if (newUrl !== imgSrc) {
        setImgSrc(newUrl);
      }
    }
  }, [fileInput[0]?.name]);

  return [imgSrc, setImgSrc];
}
