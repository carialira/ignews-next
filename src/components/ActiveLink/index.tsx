import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactNode, ReactElement,cloneElement } from "react";

interface ActiveLinkProps extends LinkProps{
children: ReactNode;
activeClassName: string;
}

export function ActiveLink ({children,activeClassName, ...rest}:ActiveLinkProps)
{
  const {asPath}= useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return(
    <Link {...rest} className={className}>
    {/* {cloneElement(children, className)} */}
    {children}
    </Link>
    );
}


