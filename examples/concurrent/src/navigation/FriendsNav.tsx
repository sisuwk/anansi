import { useRoutes } from '@anansi/router';
import { useSuspense } from 'rest-hooks';
import { memo } from 'react';

import { UserResource } from 'resources/Discuss';

import Nav from './Nav';

function FriendsNav(): JSX.Element {
  const route = useRoutes()[1] as any;
  const friends = useSuspense(UserResource.list(), {});

  return (
    <Nav
      key="nav"
      friends={friends}
      selectedFriend={route.name === 'UserDetail' && route.id}
    />
  );
}
export default memo(FriendsNav);
