import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  const [{ fetching: loggingOut }, logout] = useLogoutMutation();
  const [{ data, fetching: fetchingMe }] = useMeQuery();
  let body = <></>;
  let nav = <></>;
  const doLogout = async () => {
    await logout();
  };
  if (!fetchingMe) {
    if (data?.me) {
      body = (
        <Flex>
          <Box mr={2}>{data.me.username}</Box>
          <Button
            isLoading={loggingOut}
            onClick={doLogout}
            variant="link"
          >
            Logout
          </Button>
        </Flex>
      );
      nav = (
        <>
          <NextLink href="/">
            <Link mr={2}>New Note</Link>
          </NextLink>
        </>
      );
    } else {
      body = (
        <>
          <NextLink href="/login">
            <Link mr={2}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link mr={2}>Register</Link>
          </NextLink>
        </>
      );
    }
  }
  if (router.pathname === '/') {
    return <></>;
  }
  return (
    <div>
      <Flex bg="skyblue" p={4}>
        <Box>{nav}</Box>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </div>
  );
};