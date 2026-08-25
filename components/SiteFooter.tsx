import Link from "next/link";
import SiteBrand from "@/components/SiteBrand";
import { brand } from "@/lib/brand";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <SiteBrand />
        <p>{brand.tagline}</p>
        <div className="footer-author-links">
          <Link href={brand.creatorPath}>About {brand.creator} →</Link>
          <a href={brand.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
      <p className="trademark-disclaimer">© 2026 {brand.creator}. {brand.disclaimer}</p>
    </footer>
  );
}
