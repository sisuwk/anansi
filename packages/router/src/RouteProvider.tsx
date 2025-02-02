// TODO: Mock useTransition() to support earlier versions of react, just without v18 features
import React, { memo, useCallback, useTransition } from 'react';
import { PojoRouter, RouteController } from '@pojo-router/core';
import type { Update } from 'history';

import { IsLoadingContext } from './IsLoadingContext';
import type { Route } from './types';

type Props<ResolveWith> = {
  children: React.ReactNode;
  resolveWith: ResolveWith;
  router: RouteController<Route<ResolveWith>>;
  onChange?: (update: Update, callback: () => void | undefined) => void;
};

function RouteProvider<ResolveWith>({
  children,
  router,
  resolveWith,
  onChange,
}: Props<ResolveWith>) {
  const preloadMatch = useCallback(
    (match: Route<ResolveWith>) => {
      // load component source
      if (match.component) match.component?.preload?.();
      // load component data
      if (match.resolveData) match.resolveData(resolveWith, match);
    },
    [resolveWith],
  );

  const [isPending, startTransition] = useTransition();
  const transitionPathname = useCallback(
    (update: Update, callback: () => void) => {
      // fetch as transition/render
      const matches = router.getMatchedRoutes(update.location.pathname);
      if (matches.length) {
        matches.forEach(match => preloadMatch(match));
      }

      // transition begins
      startTransition(onChange ? () => onChange(update, callback) : callback);
    },
    [preloadMatch, router, onChange],
  );

  return (
    <PojoRouter router={router} onChange={transitionPathname}>
      <IsLoadingContext.Provider value={isPending}>
        {children}
      </IsLoadingContext.Provider>
    </PojoRouter>
  );
}

const m = memo(RouteProvider) as typeof RouteProvider;
export default m;
