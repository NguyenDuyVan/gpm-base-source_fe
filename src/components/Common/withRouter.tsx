"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function withRouter(Component: any) {
  function ComponentWithRouterProp(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
      <Component
        {...props}
        router={{ router, pathname, searchParams }}
      />
    );
  }

  return ComponentWithRouterProp;
}

export default withRouter;
