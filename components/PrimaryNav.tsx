import Link from "next/link";
import SiteBrand from "@/components/SiteBrand";
import { primaryNavigation, type NavigationKey } from "@/lib/site-structure";

export default function PrimaryNav({ active, className = "" }: { active?: NavigationKey; className?: string }) {
  return (
    <nav className={`topbar primary-nav${className ? ` ${className}` : ""}`} aria-label="Primary navigation">
      <SiteBrand />
      <div className="nav-items">
        {primaryNavigation.map((item) => (
          <Link className={`nav-link${active === item.key ? "" : " subtle"}`} href={item.href} key={item.key}>{item.label}</Link>
        ))}
      </div>
      <details className="mobile-nav">
        <summary>Explore</summary>
        <div>
          {primaryNavigation.map((item) => (
            <Link aria-current={active === item.key ? "page" : undefined} href={item.href} key={item.key}>{item.label}</Link>
          ))}
        </div>
      </details>
    </nav>
  );
}
