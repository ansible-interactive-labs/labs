import Link from "next/link";
import { brand } from "@/lib/brand";

export default function SiteBrand({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand" href={href} aria-label={`${brand.siteName} home`}>
      <span className="brand-mark">RA</span>
      <span className="brand-copy"><strong>{brand.siteName}</strong><small>{brand.descriptor}</small></span>
    </Link>
  );
}
