import React from 'react';
import { useBestRatedBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './BestRatedBooks.module.css';

function BestRatedBooks() {
  const { bestRatedBooks } = useBestRatedBooks();

  console.log('Livres les mieux notés récupérés :', bestRatedBooks);

  const bestRatedBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.map((elt) => <BookItem key={`book-${elt.id}`} book={elt} size={3} />)
  ) : <h3>Aucune recommendation</h3>;
  console.log("Livres les mieux notés affichés dans BestRatedBooks :", bestRatedBooks);

  return (
    <section className={`content-container ${styles.BestRatedBooks}`}>
      <h2>Les mieux notés</h2>
      <div className={styles.List}>
        {bestRatedBooksContent}
      </div>
    </section>
  );
}

export default BestRatedBooks;
