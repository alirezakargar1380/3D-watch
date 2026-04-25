'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { customer_axios, endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken, setCustomerSession } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
import { ICustomerItem } from 'src/types/customer';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    customer?: AuthUserType;
    admin?: AuthUserType;
  };
  [Types.LOGIN]: {
    customer?: AuthUserType;
    admin?: AuthUserType;
  };
  [Types.REGISTER]: {
    customer: AuthUserType;
    admin?: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  admin: null,
  customer: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      customer: action?.payload?.customer ? action.payload.customer : state.customer,
      admin: action?.payload?.admin ? action.payload.admin : state.admin,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      customer: action?.payload?.customer ? action.payload.customer : null,
      admin: action?.payload?.admin ? action.payload.admin : null,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      customer: action.payload.customer,
      admin: action?.payload?.admin ? action.payload.admin : null,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      customer: null,
      admin: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const CUSTOMER_STORAGE_KEY = 'customerAccessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        setSession(accessToken);

        const res = await axios.get(endpoints.admin.auth.me);

        const { user } = res.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            admin: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            customer: null,
            admin: null
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          customer: null,
          admin: null
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const customerInitialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(CUSTOMER_STORAGE_KEY);

      if (accessToken) {
        setCustomerSession(accessToken);

        const res = await customer_axios.get(endpoints.customer.auth.me);

        const { user } = res.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            customer: {
              ...user,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            customer: null
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          customer: null,
          admin: null
        },
      });
    }
  }, []);

  useEffect(() => {
    customerInitialize();
  }, [customerInitialize]);

  // Admin LOGIN
  const adminLogin = useCallback(async (username: string, password: string) => {
    const data = {
      username,
      password,
    };

    const res = await axios.post(endpoints.admin.auth.login, data);

    const { accessToken, user } = res.data;

    setSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        admin: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // Customer LOGIN
  const customerLogin = useCallback(async (username: string, password: string) => {
    const data = {
      username,
      password,
    };

    const res = await customer_axios.post(endpoints.customer.auth.login, data);

    const { accessToken, user } = res.data;

    setCustomerSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        customer: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // CUSTOMER REGISTER
  const customerRegister = useCallback(
    async (data: ICustomerItem) => {
      
      const res = await axios.post(endpoints.customer.auth.register, data);

      const { accessToken, user } = res.data;

      setCustomerSession(accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          customer: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = res.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      // dispatch({
      //   type: Types.REGISTER,
      //   payload: {
      //     customer: {
      //       ...user,
      //       accessToken,
      //     },
      //   },
      // });
    },
    []
  );


  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    setCustomerSession(null)
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.customer ? 'authenticated' : 'unauthenticated';
  const adminCheckAuthenticated = state.admin ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  const admin_status = state.loading ? 'loading' : adminCheckAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      customer: state.customer,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',

      adminAuthenticated: admin_status === 'authenticated',
      //
      customerRegister,
      adminLogin,
      customerLogin,
      register,
      logout,
    }),
    [adminLogin, customerLogin, logout, register, state.customer, state.admin, status, admin_status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
