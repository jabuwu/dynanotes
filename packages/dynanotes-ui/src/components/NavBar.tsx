import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  if (router.pathname === '/') {
    return <></>;
  }
  const [{ fetching: loggingOut }, logout] = useLogoutMutation();
  const [{ data, fetching: fetchingMe }] = useMeQuery();
  let body = <></>;
  let nav = <></>;
  if (!fetchingMe) {
    if (data?.me) {
      body = (
        <Flex>
          <Box mr={2}>{data.me.username}</Box>
          <Button
            isLoading={loggingOut}
            onClick={async () => {
              await logout();
            }}
            variant="link"
          >
            Logout
          </Button>
        </Flex>
      );
      nav = (
        <>
          <NextLink href="/">
            <Link mr={2}>Take Notes</Link>
          </NextLink>
          <NextLink href="/notes">
            <Link mr={2}>Notes</Link>
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
  return (
    <div>
      <Flex bg="skyblue" p={4}>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
      { nav }
    </div>
  );
};