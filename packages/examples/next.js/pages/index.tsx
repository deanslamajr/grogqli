import {FC, useState} from 'react';
import Link from 'next/link'

import {
  useSearchForArtistLazyQuery,
  SearchForArtistQuery,
  SearchForArtistDocument,
} from "../lib/SearchForArtist.graphql";
import { initializeApollo } from "../lib/apollo";

import styles from '../components/index.module.css';

type Artist = NonNullable<NonNullable<NonNullable<NonNullable<SearchForArtistQuery["search"]>["artists"]>["nodes"]>[number]>;

const ArtistSearchResult: FC<{artist: Artist}> = ({artist})=> {
  return (<Link href={`/artist/${artist.id}`}>
    <p className={styles['artist']}>
      <h2>{artist.name}</h2>
      {artist.area ? (<div>{artist.area.name}</div>) : null}
      <div>
      {artist?.lifeSpan?.begin !== null && artist.lifeSpan?.begin !== undefined? (
        <div>{artist.lifeSpan.begin}</div>
      ) : null}
      </div>
    </p>
  </Link>)
};

const Index = () => {
  const [invokeQuery, { data, loading }] = useSearchForArtistLazyQuery();
  const [inputValue, setInputValue] = useState('');

  return (
    <div className={styles['flex-container']}>
      {loading ? (
        <>'Loading...'</>
      ) : (
        <>
          <form className={styles['form']} onSubmit={() => invokeQuery({variables: {query: inputValue}})}>
            <div>
              <label htmlFor="musicians">Musicians</label>  
            </div>
            <div>
              <input ref={input => input && input.focus()} type="text" id="musicians" name="musicians" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input>
            </div>
            <div>
              <button type="submit">Search</button>
            </div>
          </form>
          <div>
            {data?.search?.artists?.nodes?.map(artist => artist
              ? (<ArtistSearchResult key={artist.id} artist={artist} />)
              : null
            )}
          </div>
        </>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  // uncomment to invoke the query as part of SSR
  // await apolloClient.query({
  //   query: SearchForArtistDocument,
  // });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Index;
