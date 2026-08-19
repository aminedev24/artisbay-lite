import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OldAdminSectionRedirect() {
  const router = useRouter();
  const { adminSection } = router.query;
  useEffect(() => {
    const path = adminSection ? `/admin?tab=${adminSection}` : '/admin';
    router.replace(path);
  }, [router, adminSection]);
  return null;
}
