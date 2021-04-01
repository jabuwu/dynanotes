import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const a = await register(values);
          if (a.data?.register?.user) {
            router.push('/');
          } else {
            const errors: any = {};
            for (const error of a.data?.register?.errors || []) {
              errors[error.field] = error.error;
            }
            setErrors(errors);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" label="Username" />
            <InputField name="password" label="Password" type="password" />
            <Button type="submit" isLoading={isSubmitting} mt={4}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;