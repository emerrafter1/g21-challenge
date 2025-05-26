
## Set up instructions

### Clone the repo:

git clone `https://github.com/emerrafter1/g21-challenge.git`
cd `g21-coding-challenge`

### Install dependencies:

`npm install`

### Start the development server:

`npm run dev`


## Scripts

- `npm run dev` – start dev server
- `npm run build` – create production build
- `npm start` – run production server
- `npm test` – run unit tests

### Access the application

Open `http://localhost:3000` in your browser.

## Approach

### API Routes

- `/api/review-requests` handles `GET` and `POST` requests.
- `GET`: Filters review requests based on query parameters (`status`, `documentTitle`, `documentType`, `clientName`, `priority`).
- `POST`: Accepts validated form data, appends `status: "Pending"` and the current date, and returns the new request object.

In this project, I used in-memory data via the `SAMPLE_REVIEW_REQUESTS` array, which meant all data was temporary and reset on reload. I didn’t persist changes, submitting or editing data updated local state only, nothing was saved to a database or file. This approach worked for demo purposes but made the app stateless and edits non-permanent.

### Pages and Routing

- **Submit Page** (`/submit`): A form for creating new review requests.
- **Reviews Page** (`/reviews`): Displays all requests in a sortable, filterable table.
- Uses the **App Router** with client and server components.

### State and Validation

- React `useState` manages form fields, filter selections, table state, and UI feedback.
- `zod` handles client-side validation of form inputs before submission.
- File uploads are simulated but not stored.

### In-Memory Data
- Sample data is stored in a local file (SAMPLE_REVIEW_REQUESTS), imported by the API.

- new entries are appended during POST requests (simulation only, no real database).

### Filtering

- Filters for: Status, Client Name, Document Type, Priority

- A `useEffect` watches the state of all filters.
- When any filter changes, a new query string is built using `URLSearchParams`.
- That query string is sent to `/api/review-requests`, triggering a server-side filter.
- The server returns only the data that matches the selected filter values..

### Document Search

#### How It Works (Client-Side)

- The input is controlled by `useState(documentSearchTerm)`.
- Every time you type, it updates the `documentSearchTerm` state.:
- On every change to `documentSearchTerm`, a `useEffect` runs and:
 - Trims whitespace from the search term.
 - Appends `documentTitle` as a query parameter to the API URL.
 - Makes a request to `/api/review-requests?documentTitle=...`.

#### How It Works (Server-Side)

- In the `GET` handler, the API extracts the search term: `const documentTitle = searchParams.get("documentTitle")?.trim().toLowerCase();`
- It filters SAMPLE_REVIEW_REQUESTS using:
`item.documentTitle.toLowerCase().includes(documentTitle)`
- This is a partial match, not exact. Any entry that contains the search term will be returned.

#### Server-Side Filtering

- The API route reads the `documentTitle` parameter.
- It runs a `toLowerCase().includes(...)` check on all document titles in the sample data.
- Only requests with matching titles are returned to the client.

### Table Sorting Logic

Table supports column sorting (e.g. by priority, due date). Sorting method varies depending on the column:

- A copy of the `data` array is made so the original stays unchanged.
- Sorting uses the selected column (`sortColumn`), or `"createdAt"` by default.
- For each row, values (`valA`, `valB`) from the target column are compared.
- If either value is missing, that comparison is skipped.

### Sorting by Column Type

**Dates (`dueDate`, `createdAt`)**
- Values are converted to timestamps using `new Date().getTime()`.
- Sorted numerically by date in ascending or descending order.

**Priority**
- Uses a lookup object:
`const priorityOrder = { High: 3, Medium: 2, Low: 1 };`
- Priority strings are mapped to numbers.
- Allows logical sorting from high to low or vice versa.

**Status**
- Uses another lookup object:
`const statusOrder = { Completed: 3, "In Review": 2, Pending: 1 };`
- Status strings are mapped to numbers to sort by.

**Text Fields (`clientName`, `documentTitle`, `documentType`)**
- Converted to lowercase.
- Compared alphabetically using `localeCompare()`.

### UI Components

Uses `shadcn/ui` components for:
- Form inputs and dropdowns (`Select`, `Input`, `Button`)

### Testing

A set of unit tests written with Jest to test the GET and POST API handlers from the review-requests route. It mocks requests and directly calls the handler functions to verify expected behavior.

The GET tests check that review requests are returned correctly, including when query parameters are used for filtering by status, priority, document type, title, or client name. It also verifies error handling when the data source is invalid.

The POST tests check that a new review request is accepted and that required fields are validated. It confirms that the server assigns default values like createdAt and status.

## Challenges faced

### New Tools

This was my first time using Next.js. I had to adjust to its routing model and the mix of client/server execution. I spent time understanding when to use server components versus client components, and how data fetching differs from traditional Express setups which I had used previously.

Working without a database meant managing state in memory. This made it harder to simulate real-world behavior, especially for things like editing or persisting data. I worked around it by updating local state and re-fetching data on the client side to reflect changes.

I hadn’t used Docker before, so I followed a few online tutorials to create this simple container setup. It installs dependencies, builds the app, and runs the server on port 3000. This makes it easier to run the project without needing to configure everything on my machine.

## What would you improve on with more time

### Use a real database

If I had more time, I’d connect the app to a real database like PostgreSQL to handle storage properly. Instead of using in-memory sample data, I’d create a structured table for review requests. That would let me store submitted data, update statuses, and fetch filtered results reliably across sessions. It would make the app stateful and usable beyond just a demo.

### Build a patch endpoint for status editing
I’d also add a real PATCH endpoint for review requests to handle status updates, instead of the in-memory approach I used here. For demo purposes, I kept everything in local state without persistence, but in a full version, updates would be saved to the database.

### Include E2E tests
I’d also add some end-to-end tests to cover front-end behavior and user flows. In this project, I only included a few limited back-end tests using Jest. Tools like Cypress or Playwright would help automate real user interactions and confirm that filtering, submitting, and editing review requests all work as expected.

### UI and Form UX Improvements
On the front end, I’d spend more time on styling to improve spacing, visual hierarchy, and responsiveness, especially for smaller screens. The current layout works but could be more polished and easier to scan. I’d also improve form validation by adding inline error messages and clearer user feedback. Right now, errors are handled in the code but not always surfaced to the user in a helpful way. Disabling the submit button when fields are invalid would also improve usability.