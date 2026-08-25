import SiteBrand from "@/components/SiteBrand";
import { brand } from "@/lib/brand";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <SiteBrand />
        <p>{brand.tagline}</p>
        <a href={brand.linkedin} target="_blank" rel="noreferrer">Created by {brand.creator} · LinkedIn ↗</a>
      </div>
      <p className="trademark-disclaimer">© 2026 {brand.creator}. {brand.disclaimer}</p>
    </footer>
  );
}
