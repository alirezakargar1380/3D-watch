import CustomerJwtRegisterView from 'src/sections/auth/customer-jwt/jwt-register-view';
import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Customer Register',
};

export default function RegisterPage() {
  return <CustomerJwtRegisterView />;
}
