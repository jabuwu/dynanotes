import { useNotesQuery, useMeQuery } from '../../generated/graphql';
import { Box, Link, Stack } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const Index = ({}) => {
  const [{ data, fetching }] = useNotesQuery();
  const [{ data: me, fetching: fetchingMe }] = useMeQuery();
  const router = useRouter();
  if (!fetching && !fetchingMe) {
    if (!me?.me) {
      router.push('/login');
      return <></>;
    }
    const noteList: JSX.Element[] = [];
    for (const note of data?.notes ?? []) {
      noteList.push(
        <NextLink key={ note.id } href={`/notes/${note.id}`}>
          <Link mr={2}>
            <Box p={5} shadow="md" borderWidth="1px">
              { note.text }
            </Box>
          </Link>
        </NextLink>
      );
    }
    return (
      <Stack spacing={8}>
        { noteList }
      </Stack>
    );
  } else {
    return <p>Loading...</p>;
  }
}

export default Index