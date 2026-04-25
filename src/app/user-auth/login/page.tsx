import CustomerJwtLoginView from "src/sections/auth/customer-jwt/jwt-login-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'User Login',
};

export default function LoginPage() {
  return <CustomerJwtLoginView />;
}
