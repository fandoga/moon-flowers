# Implementation Plan: Product Video Stories Integration

## Overview

This implementation plan follows the four-phase migration path outlined in the design document. The feature integrates product data with video stories by fetching products with videos, extracting video identifiers, matching them with existing videos, and displaying product information (name and thumbnail) on video cards in the Stories section while preserving the Reviews section behavior.

## Tasks

- [ ] 1. Phase 1: API Layer and Type Definitions
  - [x] 1.1 Add new type definitions for products with videos
    - Add `ProductsWithVideosQueryParams` interface to `src/entities/mp-product/types/types.ts`
    - Add `ProductsWithVideosResponse` interface to `src/entities/mp-product/types/types.ts`
    - Export both new types from the types file
    - _Requirements: 5.1, 5.2, 5.6_

  - [x] 1.2 Extend StoryVideo type with optional product fields
    - Add optional `productName?: string` field to `StoryVideo` type in `src/entities/video/types/types.ts`
    - Add optional `productPhoto?: string` field to `StoryVideo` type
    - Ensure backward compatibility with existing code
    - _Requirements: 3.7, 5.3, 5.4_

  - [x] 1.3 Implement getProductsWithVideos API function
    - Create `getProductsWithVideos` function in `src/entities/mp-product/api/api.ts`
    - Use `tableCrmApi` client to fetch from `/nomenclature/` endpoint
    - Include `has_video: true` parameter in the request
    - Follow the same pattern and error handling as `getMpProducts`
    - Return structured response with `result`, `count`, `limit`, `offset`, and optional `error`
    - Add explicit TypeScript return type annotation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.5_

  - [ ]\* 1.4 Write unit tests for API layer
    - Test `getProductsWithVideos` with successful response
    - Test `getProductsWithVideos` with network error
    - Test `getProductsWithVideos` with empty response
    - Verify correct parameters are passed to TableCRM API
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Checkpoint - Verify API layer and types
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Phase 2: Video ID Extraction and Product Matching Logic
  - [x] 3.1 Implement video ID extraction function
    - Create `extractVideoId` function in `src/widgets/stories/Stories.tsx`
    - Check if product has non-empty `videos` array
    - Extract video identifier from `videos[0].url` using regex pattern `/(\d+)(?!.*\d)/`
    - Parse the last sequence of digits as the Video_ID
    - Validate that extracted ID is a positive integer
    - Return `null` for invalid or missing data
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.2 Implement product-video matching function
    - Create `matchProductsToVideos` function in `src/widgets/stories/Stories.tsx`
    - Build a Map of video_id to product for O(1) lookup
    - Iterate through videos and match with products using the Map
    - For matched products, fetch product thumbnail using `getPicturesById`
    - Return enriched videos with `productName` and `productPhoto` fields
    - Handle missing matches gracefully by returning original video data
    - _Requirements: 3.1, 3.2, 3.4, 3.6_

  - [ ]\* 3.3 Write unit tests for extraction and matching logic
    - Test video ID extraction from valid URLs with trailing digits
    - Test extraction from URLs with multiple digit sequences
    - Test handling of empty videos array
    - Test handling of missing URL field
    - Test handling of non-numeric URLs
    - Test validation of positive integers
    - Test product matching with complete data
    - Test handling of videos without matching products
    - Test handling of products without valid video IDs
    - Test thumbnail fetching success and failure cases
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.4, 3.6_

- [ ] 4. Checkpoint - Verify extraction and matching logic
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Phase 3: Stories Component Integration
  - [x] 5.1 Add product fetching to Stories component
    - Add state for `productsWithVideos` and `isLoadingProducts` in `src/widgets/stories/Stories.tsx`
    - Create `useEffect` hook to fetch products on component mount
    - Call `getProductsWithVideos` with `limit: 50` parameter
    - Update state with fetched products
    - Handle loading and error states
    - _Requirements: 3.1, 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 5.2 Integrate product-video matching into video processing
    - Modify the `videos` useMemo hook to include product enrichment
    - Call `matchProductsToVideos` when products are available
    - Pass enriched video data to Videos component
    - Maintain fallback to original video data when products unavailable
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ]\* 5.3 Write component tests for Stories integration
    - Test Stories component with product data
    - Test Stories component without product data
    - Test error recovery when product API fails
    - Test graceful degradation when thumbnails fail to load
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [ ] 6. Checkpoint - Verify Stories component integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Phase 4: Videos Component Display Logic
  - [x] 7.1 Update video card rendering for product display
    - Modify the video card title section in `src/widgets/videos/Videos.tsx`
    - Add conditional rendering based on `isReviews` prop and product data availability
    - Display product thumbnail using Next.js Image component when available and not in Reviews mode
    - Display product name when available and not in Reviews mode
    - Fallback to video title when product data unavailable or in Reviews mode
    - Maintain existing layout and styling with gap for thumbnail
    - _Requirements: 3.3, 3.4, 3.5, 4.2, 4.3_

  - [x] 7.2 Ensure Reviews section backward compatibility
    - Verify `isReviews` prop controls rendering mode correctly
    - Test that Reviews section continues to display video titles
    - Test that Reviews section displays user avatars and stars unchanged
    - Ensure no product data is displayed in Reviews mode
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]\* 7.3 Write component tests for Videos display logic
    - Test Videos component in Stories mode (isReviews=false) with product data
    - Test Videos component in Stories mode without product data
    - Test Videos component in Reviews mode (isReviews=true)
    - Test conditional rendering of product name vs video title
    - Test conditional rendering of product thumbnail
    - Test backward compatibility with existing usage
    - _Requirements: 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]\* 7.4 Write integration tests for end-to-end flow
    - Test complete flow from product fetch to video card display
    - Test Stories section displays product information correctly
    - Test Reviews section displays video metadata unchanged
    - Test error recovery scenarios
    - Test loading states display correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 8. Final checkpoint and validation
  - Ensure all tests pass
  - Verify Stories section displays product names and thumbnails on video cards
  - Verify Reviews section behavior is unchanged
  - Verify error handling and fallback scenarios work correctly
  - Verify performance and loading states are acceptable
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows the four-phase migration path from the design document
- Checkpoints ensure incremental validation at each phase
- All changes maintain backward compatibility with the Reviews section
- Product data is additive and gracefully degrades when unavailable
