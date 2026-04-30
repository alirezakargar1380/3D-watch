import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, customerFetcher } from 'src/utils/axios';

import { IPostItem } from 'src/types/blog';
import { ICartItem } from 'src/types/cart';
import { IAddressItem } from 'src/types/address';

// ----------------------------------------------------------------------

export function useGetAddress() {
  const URL = endpoints.address.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, customerFetcher);

  const refresh = () => {
    mutate(URL);
  };

  const memoizedValue = useMemo(
    () => ({
      address: (data as IAddressItem[]) || [],
      cartLoading: isLoading,
      cartError: error,
      cartValidating: isValidating,
      cartEmpty: !isLoading && !data?.length,
      refresh
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}