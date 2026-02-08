# AvgPay Use Cases - Comprehensive Testing Matrix

## Use Cases 1-10: Core Analyzer Flow
1. **New Grad First Offer** - BS Computer Science, Google L3, SF, $140k base
2. **Mid-Level Comparison** - Meta E4 vs Google L4, both NYC, comparing offers
3. **Senior Negotiation** - Staff Engineer at Stripe, SF, pushing for $400k+
4. **Remote Worker** - Software Engineer, Remote from Denver, company in SF
5. **Career Switch** - PM with 5 years consulting, seeking tech role
6. **Startup vs Big Tech** - Series B startup equity vs Amazon L5
7. **International** - H-1B holder comparing offers with visa constraints
8. **Contractor to FTE** - Current $120/hr, evaluating $180k salary offer
9. **Level Bump** - Current L5 at Google, negotiating L6 at Meta
10. **Relocation** - Moving from Austin to Seattle, cost of living adjustment

## Use Cases 11-20: Content Discovery
11. **Organic Search** - Google "product manager salary san francisco"
12. **LinkedIn Share** - User shares PM Guide to network
13. **Twitter Discovery** - Finds site via salary insight tweet
14. **Referral** - Friend sends link to negotiation guide
15. **Bookmark Return** - User returns to check updated data
16. **Newsletter** - Subscribes to market updates
17. **Comparison Shopping** - Checks 3 companies before applying
18. **Interview Prep** - Researches company before onsite
19. **Annual Review** - Checks market before performance review
20. **Side Project** - Indie hacker researching contractor rates

## Use Cases 21-30: Edge Cases & Error States
21. **No Data Available** - Niche role (DevRel) in small market
22. **Unrealistic Input** - Enters $10M salary (test validation)
23. **Incomplete Form** - Submits without required fields
24. **Mobile Only** - Uses site entirely on iPhone
25. **Slow Connection** - 3G network, testing loading states
26. **Ad Blocker** - Blocks analytics, testing core functionality
27. **JavaScript Disabled** - Graceful degradation test
28. **Old Browser** - Safari 14, testing compatibility
29. **Screen Reader** - VoiceOver testing accessibility
30. **Keyboard Only** - Tab navigation without mouse

## Use Cases 31-40: Business & Conversion
31. **Free to PRO** - Uses analyzer 2x, hits limit, converts
32. **Contribute Data** - Submits salary, returns to see impact
33. **Share Data** - Takes screenshot of results, shares
34. **Return Visitor** - Checks 3 different roles over 2 weeks
35. **Company Research** - Views 5 company pages before applying
36. **Guide Download** - Prints PM guide for offline reading
37. **API Integration** - Developer tests /api/salaries endpoint
38. **Database Submission** - Submits via form, verifies in Supabase
39. **Social Proof** - Reads testimonials (need to add)
40. **Trust Verification** - Checks methodology before trusting data

## Critical Success Metrics
- Time to first analysis: < 30 seconds
- Form completion rate: > 70%
- Page load time: < 2 seconds
- Mobile usability: Perfect score
- SEO ranking: Top 10 for "[role] salary [location]"
- Conversion rate: > 5% to PRO
