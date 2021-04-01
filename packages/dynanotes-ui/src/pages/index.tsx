import { Field, Form, Formik } from 'formik';
import { useMeQuery, useCreateNoteMutation } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { Textarea } from '@chakra-ui/textarea';
import { FormControl } from '@chakra-ui/form-control';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';

const Index = ({}) => {
  const router = useRouter();
  const [ , createNote ] = useCreateNoteMutation();
  const [{ data: me, fetching: fetchingMe }] = useMeQuery();
  if (fetchingMe) {
    return <div>Loading...</div>;
  } else {
    if (!me?.me) {
      router.push('/login');
      return <></>;
    }
    return (
      <Flex h="100vh" flexDirection="row">
        <Formik initialValues={{ text: '' }} onSubmit={async (values, { setErrors }) => {
          if (values.text) {
            const { data, error } = await createNote(values);
            if (error) {
              setErrors({ text: error.message });
            } else {
              values.text = '';
            }
          } else {
              router.push('/notes');
          }
        }}>
          {({ isSubmitting, values }) => (
            <Form className="flex1">
              <Flex flexDirection="column" flex="1">
                <Field name="text" m={0}>
                  {({ field, form }: any) => (
                    <FormControl lineHeight={0} className="flex1">
                      <Textarea {...field} id="text" spellcheck="false" className="note" borderRadius={0} />
                    </FormControl>
                  )}
                </Field>
                <Button type="submit" isLoading={isSubmitting} m={0} borderRadius={0} colorScheme="blue" size="lg" className="createNoteButton">
                  { values.text == '' ? 'Dashboard' : 'Create Note' }
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    );
  }
}

export default Index