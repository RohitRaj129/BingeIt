import { notFound } from "next/navigation";

type Props = {
  params: {
    term: string;
  };
};

function SearchPage({ params: { term } }: Props) {
  if (!term) notFound();

  const termToUSe = decodeURI(term);

  //API call  to get seacrhed movies
  //API call to get the popular movies

  return <div> Welcome to the Search page: {termToUSe} </div>;
}

export default SearchPage;
