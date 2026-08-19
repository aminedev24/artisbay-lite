// pages/reset-password/[token].js
import { useRouter } from 'next/router';
import ResetPassword from '../../components/forms/resetPassword';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  // If ResetPassword expects the token as a prop, pass it along:
  return <ResetPassword token={token} />;
}
