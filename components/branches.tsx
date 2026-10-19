import Link from "next/link";
import { BranchMap } from "@/components/branch-map";
import { branches, googleRating } from "@/lib/branches";
import { siteConfig, telHref } from "@/lib/site-config";

/** "Three branches. One number." – branch addresses, Google rating and map. */
export function BranchesSection({ headingLevel = 2, showAllLink = true }: { headingLevel?: 2 | 3; showAllLink?: boolean }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const stars = Math.round(googleRating.rating);
  return (
    <section className="section branches-section" aria-labelledby="branches-heading">
      <div className="container">
        <BranchMap
          branches={branches}
          intro={
            <>
              <Heading id="branches-heading" className="branches-title">
                Three branches.
                <br />
                One number.
              </Heading>
              <a className="branches-phone" href={telHref()}>
                {siteConfig.phone}
              </a>
            </>
          }
          footer={
            <>
              <p className="branches-rating">
                <span className="stars" aria-hidden="true">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </span>
                Rated {googleRating.rating} from {googleRating.count} reviews on{" "}
                <a href={googleRating.url} target="_blank" rel="noopener noreferrer">
                  Google
                </a>
              </p>
              {showAllLink && (
                <Link className="branches-all" href="/network">
                  See all branches on the map <span aria-hidden="true">›</span>
                </Link>
              )}
            </>
          }
        />
      </div>
    </section>
  );
}
