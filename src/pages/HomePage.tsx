import { Hero } from '../sections/Hero/Hero'
import { TrustMarquee } from '../sections/TrustMarquee/TrustMarquee'
import { FeaturedCases } from '../sections/FeaturedCases/FeaturedCases'
import { MoreProjects } from '../sections/MoreProjects/MoreProjects'
import { Skills } from '../sections/Skills/Skills'
import { Process } from '../sections/Process/Process'
import { Experience } from '../sections/Experience/Experience'
import { Contact } from '../sections/Contact/Contact'

export default function HomePage() {
  return <main id="main"><Hero /><TrustMarquee /><FeaturedCases /><MoreProjects /><Skills /><Process /><Experience /><Contact /></main>
}
