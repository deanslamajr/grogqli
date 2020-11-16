import {FC} from 'react';
import { useRouter } from 'next/router'

import { initializeApollo } from "../../lib/apollo";
import {
  useArtistLookupQuery,
  ArtistLookupQuery,
} from '../../lib/ArtistLookup.graphql';

import styles from '../../components/artist.module.css';

type ReleaseProp = Pick<
  NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<ArtistLookupQuery["lookup"]>["artist"]>["releaseGroups"]>["nodes"]>[number]>,
  "title" | "firstReleaseDate" | "coverArtArchive" 
>;

const Release: FC<{release: ReleaseProp}> = ({release}) => {
  const images = release.coverArtArchive?.images && release.coverArtArchive.images.map(
    image => image?.thumbnails.small
      ? image.thumbnails.small
      : image?.thumbnails.large
        ? image.thumbnails.large
        : image?.image
          ? <img src={image.image} />
          : null
  );
  const imageUrl = images?.find(Boolean);

  return (<div className={styles['release']}>
    <div>{release.title}</div>
    <div>{release.firstReleaseDate}</div>
    {imageUrl
      ? <img src={imageUrl} />
      : null
    }
  </div>)
}

const Artist = () => {
  const router = useRouter()
  const { artistId } = router.query
  const {data, loading, error} = useArtistLookupQuery({variables: {artistId}});

  if (loading) {
    return (<div className={styles['outer-container']}>Loading...</div>);
  }

  if (error) {
    console.error(error);
    return (<div className={styles['outer-container']}>error</div>);
  }

  if (data?.lookup?.artist === null || data?.lookup?.artist === undefined) {
    return (<div className={styles['outer-container']}>Artist not found</div>)
  }

  const {lookup: {artist: {
    name,
    releaseGroups
  }}} = data;

  return (<p className={styles['outer-container']}>
    <h1>{name || ''}</h1>
    {(releaseGroups?.nodes !== null && releaseGroups?.nodes !== undefined)
      ? releaseGroups.nodes
        .filter(release => (release !== undefined && release !== null))
        .map(release => <Release release={release} />)
      : <div className={styles['release']}>No known releases</div>
    }
  </p>);
}

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

export default Artist