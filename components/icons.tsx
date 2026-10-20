import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { faFacebookF, faInstagram, faLinkedinIn, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";

/**
 * Inline SVG icons (Font Awesome Free, CC BY 4.0), rendered on the server.
 * No icon font or extra stylesheet is loaded.
 */
function Svg({ icon, className, title }: { icon: IconDefinition; className?: string; title?: string }) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`icon${className ? " " + className : ""}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      fill="currentColor"
    >
      {title && <title>{title}</title>}
      {(Array.isArray(path) ? path : [path]).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

type IconProps = { className?: string; title?: string };
export const PhoneIcon = (p: IconProps) => <Svg icon={faPhone} {...p} />;
export const WhatsAppIcon = (p: IconProps) => <Svg icon={faWhatsapp} {...p} />;
export const LinkedInIcon = (p: IconProps) => <Svg icon={faLinkedinIn} {...p} />;
export const FacebookIcon = (p: IconProps) => <Svg icon={faFacebookF} {...p} />;
export const InstagramIcon = (p: IconProps) => <Svg icon={faInstagram} {...p} />;
export const LocationIcon = (p: IconProps) => <Svg icon={faLocationDot} {...p} />;
export const MailIcon = (p: IconProps) => <Svg icon={faEnvelope} {...p} />;
