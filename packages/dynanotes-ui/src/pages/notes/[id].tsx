import { useNoteQuery, useDeleteNoteMutation, useMeQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { Textarea, Flex, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = ({}) => {
  const router = useRouter();
  const id = String(router.query.id);
  const [{ data, fetching }] = useNoteQuery({ variables: { id } });
  const [, deleteNote] = useDeleteNoteMutation();
  const [{ data: me, fetching: fetchingMe }] = useMeQuery();
  const breadCrumb = (
    <Breadcrumb m={4}>
      <BreadcrumbItem>
        <NextLink href="/notes">
          <BreadcrumbLink>Notes</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <NextLink href={`/notes/${id}`}>
          <BreadcrumbLink>{ id }</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
  if (!fetching && !fetchingMe) {
    if (!me?.me) {
      router.push('/login');
      return <></>;
    }
    return (
      <>
      { breadCrumb }
      <Flex h="50vh" flexDirection="column">
        <Textarea isReadOnly={true} className="note" value={ data?.note?.text } />
        <Box m={4}>
          <Box>
            <b>Created At:</b> { new Date(data?.note?.createdAt ?? 0).toUTCString() }
          </Box>
          {
            (data?.note?.createdAt != data?.note?.modifiedAt) ? (
              <Box>
                <b>Modified At:</b> { new Date(data?.note?.modifiedAt ?? 0).toUTCString() }
              </Box>
            ) : null
          }
          <Button mt={4} colorScheme="red" onClick={async () => {
            await deleteNote({ id });
            router.push('/notes');
          }}>Delete</Button>
        </Box>
      </Flex>
      </>
    );
  } else {
    return (
      <>
        { breadCrumb }
        <p>Loading...</p>
      </>
    );
  }
}

export default Index