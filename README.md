# Hospital recommender system

### Recommender System (Hospital Patient Recommender)

A Node.js + TypeScript Express API that allows patients to discover and interact with hospitals based on location, distance, and ratings. It supports authentication, hospital management (including images, specialists, facilities, services), appointment booking, and personalized recommendations.

### Prerequisites

- **Node.js**: v18+ (project uses features compatible with Node 18)
- **npm**: v8+
- **MongoDB**: Atlas cluster or local instance (connection string required)
- **Cloudinary account**: for image uploads

### Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Web Framework**: Express
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (Authorization: Bearer <token>)
- **Uploads**: Multer + Cloudinary

### Project Structure

### GitHub Repository Link

https://github.com/chile4coding/system_recommender.git

```
src/
  helpers/
    error-handler.ts
    intefaces/
      error-inteface.ts
    utils.ts
  middleware/
    auth/
      auth.ts
  modules/
    users/
      models/
        appointment.model.ts
        hospital.model.ts
        user.model.ts
      service/
        appointment.service.controller.ts
        hospial.service.ts
        user.service.controller.ts
  routes/
    hospital.route.ts
    route.ts
    user.routes.ts
index.ts
```

- Base API prefix is `/v1` (see `src/routes/route.ts`).

### Configuration

Create a `.env` file in the project root with the following keys:

```
PORT=5000
URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET_KEY=<your_jwt_secret>

# Cloudinary
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_UPLOAD_PATH=hrssystem
```

Notes:

- `URL` is your MongoDB connection string.
- `CLOUDINARY_UPLOAD_PATH` is the destination folder name used by Cloudinary uploads.

### Installation

```bash
# from the repository root
npm install
```

### Running the project

- **Development (watch mode)**

```bash
npm run dev
```

This runs TypeScript compilation in watch mode and starts the server with nodemon. The server will be available at `http://localhost:${PORT}`.

- **Production build and start**

```bash
npm run build
npm start
```

This outputs JavaScript to `build/` and runs `node build/index.js`.

### Data storage

- MongoDB stores Users, Hospitals, and Appointments.
- Local temp upload dirs used by Multer:
  - `uploads/` for user-related uploads
  - `hospitals/` for hospital-related uploads
    Files are then uploaded to Cloudinary in services where applicable.

### Authentication

- JWT-based. Provide the token in the `Authorization` header as `Bearer <token>`.
- Obtain a token via the `/v1/login` endpoint.

Example login request:

```bash
curl -X POST http://localhost:5000/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourPassword"
  }'
```

Response includes `token` to use in subsequent requests.

### API Overview

Base path: `http://localhost:${PORT}/v1`

- **Auth & User**

  - `POST /register` — create user. Body: `{ email, password, fullName }`
  - `POST /login` — login. Body: `{ email, password }`
  - `POST /update_user` — update profile (name, gender, status, displayName). Auth required.
  - `POST /update_user_complete` — update `email` and `phone`. Auth required.
  - `POST /upload` — update user avatar. Auth required. Body: `{ image: "<image_url_string>" }` (note: this endpoint expects a URL string, not a file upload).
  - `POST /add_location` — set user location. Body: `{ longitude, latitude }`. Auth required.
  - `GET /get_user` — fetch current user. Auth required.

- **Appointments**

  - `POST /book_appointment` — book appointment. Body: `{ hospital, specialist, purpose, time, date }`. Auth required.
  - `GET /get_appointments` — list user appointments. Auth required.
  - `PATCH /update_appointment_status` — update an appointment status. Body: `{ appointmentId, status }`. Auth required.
  - `GET /appointment_auto_update` — recalculates appointment status based on dates. Auth required.
  - `GET /get_userAppointment_dashboard` — monthly counts for current year. Auth required.

- **Hospitals**

  - `POST /create_hospital` — create hospital. Body: `{ name, address, phone, long, lat, city, desc, website }`.
  - `POST /create_specialist/:hospitalId/:specialist/:position` — add specialist (multipart with file `image`).
  - `POST /create_facility/:hospitalId/:name/:hospitalName` — add facility (multipart with file `image`).
  - `POST /create_service/:hospitalId` — add service. Body: `{ service }`.
  - `POST /rate_hospital` — rate a hospital. Body: `{ hospitalId, rate }`. Auth required.
  - `POST /upload_hospital_image/:hospitalId` — upload hospital avatar (multipart with file `image`).
  - `GET /get_hospitals` — list hospitals. Auth required.

- **Recommendations**
  - `GET /recommendation` — recommends by proximity (if user location set) else by ratings. Auth required.
  - `GET /recommendation_location` — recommends by proximity only. Auth required.
  - `GET /recommendation_rating` — recommends by ratings only. Auth required.

### Example requests

- Register

```bash
curl -X POST http://localhost:5000/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourPassword",
    "fullName": "Jane Doe"
  }'
```

- Set location

```bash
curl -X POST http://localhost:5000/v1/add_location \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "longitude": 3.3792, "latitude": 6.5244 }'
```

- Create hospital

```bash
curl -X POST http://localhost:5000/v1/create_hospital \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City Hospital",
    "address": "123 Main St",
    "phone": "+2348000000000",
    "long": 3.3792,
    "lat": 6.5244,
    "city": "Lagos",
    "desc": "24/7 care",
    "website": "https://city-hospital.example"
  }'
```

- Upload hospital image (multipart)

```bash
curl -X POST http://localhost:5000/v1/upload_hospital_image/<HOSPITAL_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -F image=@/absolute/path/to/file.jpg
```

- Create specialist (multipart, params in URL)

```bash
curl -X POST "http://localhost:5000/v1/create_specialist/<HOSPITAL_ID>/Cardiologist/Lead" \
  -H "Authorization: Bearer <TOKEN>" \
  -F image=@/absolute/path/to/specialist.jpg
```

### Notes on geospatial queries

- Hospitals use a GeoJSON `location` field with `type: "Point"` and `coordinates: [longitude, latitude]`.
- A 2dsphere index is defined on `Hospital` (`hospitalSchema.index({ location: "2dsphere" })`).
- Recommendations by location use `$near` with `$maxDistance` of 10,000 meters.

### Development tips

- The dev script runs TypeScript compilation in watch mode and nodemon against the built JavaScript. Ensure `build/` is created on first run by `npm run dev` (which triggers a watch compile). If you prefer running TypeScript directly, you can run:

```bash
npx ts-node src/index.ts
```

- CORS is open to all origins in `src/index.ts` for local development.

### Troubleshooting

- "MongoNetworkError" or connection failures: verify `URL` in `.env` and that MongoDB is reachable.
- Cloudinary upload errors: verify `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `CLOUDINARY_UPLOAD_PATH`.
- 401 Unauthorized: ensure you send `Authorization: Bearer <token>` from `/v1/login`.
- File upload issues: endpoints that accept files require `multipart/form-data` and use the `image` field.

### Scripts

- `npm run dev`: TypeScript watch + nodemon
- `npm run build`: Compile to `build/`
- `npm start`: Build then run `node build/index.js`

### License

ISC
