import { useNoteQuery, useDeleteNoteMutation, useMeQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { Textarea, Flex } from '@chakra-ui/react';

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
      <Flex h="50vh" flexDirection="column">
        <Textarea isReadOnly={true} className="note">{ data?.note!.text }</Textarea>
        <button onClick={async () => {
          await deleteNote({ id });
          router.push('/notes');
        }}>Delete</button>
      </Flex>
    );
  } else {
    return <p>Loading...</p>;
  }
}

export default Index