import { Field, Form, Formik } from 'formik';
import { useMeQuery, useCreateNoteMutation } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { Textarea } from '@chakra-ui/textarea';
import { FormControl } from '@chakra-ui/form-control';
import { useRouter } from 'next/router';

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
      <div>
        <Formik initialValues={{ text: '' }} onSubmit={async (values, { setErrors }) => {
          const { data, error } = await createNote(values);
          if (error) {
            setErrors({ text: error.message });
          } else {
            router.push('/notes');
          }
        }}>
          {({ isSubmitting }) => (
            <Form>
              <Field name="text">
                {({ field, form }: any) => (
                  <FormControl>
                    <Textarea {...field} id="text" placeholder="text" />
                  </FormControl>
                )}
              </Field>
              <Button type="submit" isLoading={isSubmitting} mt={4}>
                Create Note
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default Index