# Requirements Document

## Introduction

This feature integrates product data with video stories in the Stories component. Currently, the Stories component displays videos with basic metadata (title, avatar, poster). This enhancement will fetch products that have associated videos, extract video identifiers from product data, match them with existing videos, and display product information (name and thumbnail) on video cards instead of generic video titles.

The integration will only affect the Stories block, preserving the existing Reviews section behavior unchanged.

## Glossary

- **Stories_Component**: The React component located at `src/widgets/stories/Stories.tsx` that displays video stories on the main page
- **Videos_Component**: The reusable React component at `src/widgets/videos/Videos.tsx` that renders video cards and modal views
- **Product_API**: The API module at `src/entities/video/api/api.ts` responsible for fetching product data with videos
- **Video_API**: The existing API module at `src/entities/video/api/api.ts` that fetches video recommendations
- **TableCRM_API**: The configured axios client for the TableCRM backend service
- **Product**: An MpProduct entity from the nomenclature endpoint that contains video data
- **Video_ID**: A numeric identifier extracted from the product's video URL used to match videos
- **StoryVideo**: The TypeScript type representing a video story with metadata
- **Product_Thumbnail**: The mini-photo image of a product displayed alongside the product name

## Requirements

### Requirement 1: Fetch Products with Videos

**User Story:** As a developer, I want to fetch products that have associated videos from the nomenclature endpoint, so that I can display product information on video cards.

#### Acceptance Criteria

1. THE Product_API SHALL provide a function named `getProductsWithVideos` that fetches products from the `/nomenclature/` endpoint
2. WHEN fetching products, THE Product_API SHALL use the TableCRM_API client configured in `src/shared/api/clients.ts`
3. WHEN fetching products, THE Product_API SHALL include the parameter `has_video: true` to filter only products with videos
4. WHEN the API request succeeds, THE Product_API SHALL return a response containing an array of Product entities
5. WHEN the API request fails, THE Product_API SHALL return an error response with an empty result array and error message
6. THE Product_API SHALL follow the same pattern and structure as the existing `getMpProducts` function in `src/entities/mp-product/api/api.ts`

### Requirement 2: Extract Video Identifiers from Product Data

**User Story:** As a developer, I want to extract video identifiers from product video URLs, so that I can match products with their corresponding videos.

#### Acceptance Criteria

1. WHEN a Product contains a non-empty `videos` array, THE System SHALL extract the video identifier from the first video object
2. THE System SHALL extract the video identifier from the `url` field of `videos[0]`
3. THE System SHALL parse the last sequence of digits from the video URL as the Video_ID
4. WHEN the `videos` array is empty, THE System SHALL skip that Product
5. WHEN the video URL does not contain numeric digits, THE System SHALL skip that Product
6. FOR ALL extracted Video_IDs, the identifier SHALL be a positive integer

### Requirement 3: Display Product Information on Video Cards

**User Story:** As a user viewing the Stories section, I want to see which product each video is showcasing with the product name and thumbnail displayed on the video card, so I can easily identify and order the bouquet from the video.

#### Acceptance Criteria

1. WHEN the Stories_Component renders, THE Stories_Component SHALL fetch products with videos using the Product_API
2. WHEN products are fetched, THE Stories_Component SHALL match each Product to its corresponding video using the extracted Video_ID
3. WHEN a video has a matched Product, THE Videos_Component SHALL display the Product name instead of the video title
4. WHEN a video has a matched Product, THE Videos_Component SHALL display the Product_Thumbnail on the left side of the Product name
5. WHEN a video does not have a matched Product, THE Videos_Component SHALL display the original video title
6. THE Product_Thumbnail SHALL be fetched using the existing `getPicturesById` function from `src/entities/mp-product/api/api.ts`
7. THE StoryVideo type SHALL be extended to include optional product information fields (product name and product photo URL)

### Requirement 4: Preserve Reviews Section Behavior

**User Story:** As a developer, I want to ensure that changes only affect the Stories block, so that the Reviews section continues to function with its existing logic.

#### Acceptance Criteria

1. THE Videos_Component SHALL support rendering with or without product data
2. WHEN the `isReviews` prop is true, THE Videos_Component SHALL use the existing video title and metadata display logic
3. WHEN the `isReviews` prop is false or undefined, THE Videos_Component SHALL use product data if available
4. THE Reviews section SHALL continue to fetch and display videos using the existing Video_API without modification
5. ALL changes to the Videos_Component SHALL be backward compatible with existing usage in the Reviews section

### Requirement 5: Type Safety and Data Structures

**User Story:** As a developer, I want proper TypeScript types for the product-video integration, so that the code is type-safe and maintainable.

#### Acceptance Criteria

1. THE System SHALL define a new query parameters type for the `getProductsWithVideos` function
2. THE System SHALL define a response type for the `getProductsWithVideos` function that matches the TableCRM API response structure
3. THE StoryVideo type SHALL be extended with optional fields: `productName` (string) and `productPhoto` (string)
4. THE extended StoryVideo type SHALL maintain backward compatibility with existing code
5. ALL new API functions SHALL have explicit TypeScript return type annotations
6. ALL new types SHALL be exported from their respective type definition files
