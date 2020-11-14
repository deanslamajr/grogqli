import {
  useSearchForArtistLazyQuery,
  SearchForArtistDocument,
} from "../lib/SearchForArtist.graphql";
import { initializeApollo } from "../lib/apollo";

const Index = () => {
  const [invokeQuery, { data, loading }] = useSearchForArtistLazyQuery();

  return (
    <div>
      {loading ? (
        <div>'Loading...'</div>
      ) : (
        <div>
          {JSON.stringify(data)}
          <input
            type="button"
            value="Invoke query"
            onClick={() => {
              invokeQuery();
            }}
          />
        </div>
      )}
    </div>
  );
};

export async function getStaticProps() {
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
