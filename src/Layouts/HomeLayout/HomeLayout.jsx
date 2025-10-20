import ClaimsGuideSection from '@/Pages/Home/ClaimsGuideSection'
import CustomerReviews from '@/Pages/Home/CustomerReviews'
import FAQSection from '@/Pages/Home/FAQSection'
import HeroBanner from '@/Pages/Home/HeroBanner'
import LatestBlogs from '@/Pages/Home/LatestBlogs'
import MeetOurAgents from '@/Pages/Home/MeetOurAgents'
import Newsletter from '@/Pages/Home/Newsletter'
import PopularPolicies from '@/Pages/Home/PopularPolicies'
import React from 'react'

const HomeLayout = () => {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <PopularPolicies></PopularPolicies>
      <CustomerReviews></CustomerReviews>
      <LatestBlogs></LatestBlogs>
      <Newsletter></Newsletter>
      <MeetOurAgents></MeetOurAgents>
      <ClaimsGuideSection></ClaimsGuideSection>
      <FAQSection></FAQSection>
    </div>
  )
}

export default HomeLayout