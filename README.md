Overview
This project is a Node.js REST API application that accepts latitude and longitude as input parameters and returns a sorted list of users within a 10-kilometer radius. The API includes pagination and robust error handling.

Prerequisites
1. Node.js (v20.15.0)
2. npm (version 8.5.1)
3. MongoDB (local or cloud instance)

Instructions
1. Clone Repository
- git clone <repository-url>
- cd <repository-directory>

2. Install Dependencies using command:
npm install

3. Environment Configuration
PORT= Port number
MONGODB_URI=mongodb://localhost:27017/your-db-name

4. Database Configuration / setup
- Ensure MongoDB is running.
- The database schema expects a users collection with documents containing location field in GeoJSON format:
{
  "name": "Onah Stephen",
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}

5. Run the application using command: 
npm start

APi Endpoints:
GET /api/users-within-radius

Description: Retrieves users within a 10-kilometer radius of the given latitude and longitude.

Query Parameters:

- latitude (required): Latitude of the central point.
- longitude (required): Longitude of the central point.
- page (optional): Page number for pagination (default is 1).
- limit (optional): Number of results per page (default is 10).

Example Request is:  
GET http://localhost:3000/api/users-within-radius?latitude=40.7128&longitude=-74.0060&page=1&limit=10

Example Response is:
{
  "currentPage": 1,
  "totalPages": 2,
  "totalUsers": 15,
  "users": [
    {
      "name": "John Doe",
      "location": {
        "type": "Point",
        "coordinates": [-74.006, 40.7128]
      },
      "distance": 0.5
    },
    ...
  ]
}

POST /api/add-user

Description: Adds a user to endpoints.

Req.body:

- Latitude
- Longitude
- name

Example request is:
POST http://localhost:3000/api/add-user

Example response is:
{
  "_id": "60d9f9f9d6e6784f48f8b234",
  "name": "Onah Stephen",
  "location": {
    "type": "Point",
    "coordinates": [77.594566, 12.9715987]
  },
  "__v": 0
}

Error Handling
- 400 Bad Request: If required parameters are missing or invalid.
{
  "error": "Latitude and longitude are required"
}

- 500 Internal Server Error: For any server-side errors.
{
  "error": "Internal server error"
}

Additional Information

- GeoJSON Format: Ensure that user location data is stored in GeoJSON format for proper querying and distance calculations.
- Haversine Formula: Used for calculating the distance between two points on the Earth's surface.

