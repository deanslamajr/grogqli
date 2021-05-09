import { FC, useState } from 'react';
import Link from 'next/link';

import {
  useSearchForArtistLazyQuery,
  SearchForArtistQuery,
} from '../generated/graphbrainz';
import { useGetThingLazyQuery } from '../generated/schema';
import { initializeApollo, LOCAL_GQL_KEY } from '../lib/apollo';

import { ValuesContainer } from '../components/ValuesContainer';
import styles from '../components/index.module.css';

type Artist = NonNullable<
  NonNullable<
    NonNullable<NonNullable<SearchForArtistQuery['search']>['artists']>['nodes']
  >[number]
>;

const ArtistSearchResult: FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <Link href={`/artist/${artist.id}`}>
      <div className={styles['artist']}>
        <h2>{artist.name}</h2>
        {artist.area ? <div>{artist.area.name}</div> : null}
        <div>
          {artist?.lifeSpan?.begin !== null &&
          artist.lifeSpan?.begin !== undefined ? (
            <div>{artist.lifeSpan.begin}</div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

const Index = () => {
  const [invokeQuery, { data, loading }] = useSearchForArtistLazyQuery();
  const [
    getThing,
    { data: thingData, loading: isThingLoading },
  ] = useGetThingLazyQuery({
    fetchPolicy: 'network-only',
    context: {
      clientName: LOCAL_GQL_KEY,
    },
  });
  const [inputValue, setInputValue] = useState('');

  return (
    <div className={styles['flex-container']}>
      <ValuesContainer />
      <div className={styles['form']}>
        <div>
          <input value="Get thing!" type="button" onClick={() => getThing()} />
        </div>
        <div>{thingData ? JSON.stringify(thingData) : null}</div>
        <div>{isThingLoading ? 'loading thing' : null}</div>
      </div>
      {loading ? (
        <>'Loading...'</>
      ) : (
        <>
          <form
            className={styles['form']}
            onSubmit={(e) => {
              e.preventDefault();
              invokeQuery({ variables: { query: inputValue } });
            }}
          >
            <div>
              <label htmlFor="musicians">Musicians</label>
            </div>
            <div>
              <input
                ref={(input) => input && input.focus()}
                type="text"
                id="musicians"
                name="musicians"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              ></input>
            </div>
            <div>
              <button type="submit">Search</button>
            </div>
          </form>
          <div>
            {data?.search?.artists?.nodes?.map((artist) =>
              artist ? (
                <ArtistSearchResult key={artist.id} artist={artist} />
              ) : null
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
