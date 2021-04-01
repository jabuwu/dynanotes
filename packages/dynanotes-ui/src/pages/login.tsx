import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await login(values);
          if (data?.login.user) {
            router.push('/');
          } else {
            const errors: any = {};
            for (const error of data?.login?.errors || []) {
              errors['password'] = error;
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;