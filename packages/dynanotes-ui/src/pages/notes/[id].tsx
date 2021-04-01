import { useNoteQuery, useDeleteNoteMutation, useMeQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';

const Index = ({}) => {
  const router = useRouter();
  const id = String(router.query.id);
  const [{ data, fetching }] = useNoteQuery({ variables: { id } });
  const [, deleteNote] = useDeleteNoteMutation();
  const [{ data: me, fetching: fetchingMe }] = useMeQuery();
  if (!fetching && !fetchingMe) {
    if (!me?.me) {
      router.push('/login');
      return <></>;
    }
    return (
      <div>
        <p>{ data?.note!.text }</p>
        <button onClick={async () => {
          await deleteNote({ id });
          router.push('/notes');
        }}>Delete</button>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}

export default Index