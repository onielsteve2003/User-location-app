const User = require('../models/User');

const getUserWithInRadius = async (req, res) => {
  const { latitude, longitude, page = 1, limit = 10 } = req.query;
  const radiusKm = 10; // 10 km
  const radius = radiusKm / 6378.1; // Convert km to radians (Earth's radius is approximately 6378.1 km)

  // Check if latitude and longitude are provided
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: 'Latitude and longitude are required'
    });
  }

  // Validate latitude and longitude
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({
      error: 'Invalid latitude or longitude'
    });
  }

  // Validate page and limit
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  if (isNaN(pageNumber) || pageNumber <= 0 || isNaN(limitNumber) || limitNumber <= 0) {
    return res.status(400).json({
      error: 'Invalid page or limit'
    });
  }

  try {
    const users = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lon, lat], radius]
        }
      }
    });

    // Haversine formula to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Calculate distance for each user and sort by distance
    const usersWithDistance = users.map(user => {
      const distance = calculateDistance(
        lat,
        lon,
        user.location.coordinates[1],
        user.location.coordinates[0]
      );
      return { ...user._doc, distance };
    }).sort((a, b) => a.distance - b.distance);

    // Pagination
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;
    const paginatedResults = usersWithDistance.slice(startIndex, endIndex);

    // Return paginated and sorted users with distance
    res.json({
      currentPage: pageNumber,
      totalPages: Math.ceil(usersWithDistance.length / limitNumber),
      totalUsers: usersWithDistance.length,
      users: paginatedResults
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const addUserEndpoint = async (req, res) => {
  // Extract name, latitude, and longitude from request body
  const { name, latitude, longitude } = req.body;

  // Check if name, latitude, and longitude are provided
  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
  }

  try {
    const user = new User({
      name,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    // Save user to the database
    await user.save();
    // Return the saved user
    res.json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    getUserWithInRadius,
    addUserEndpoint
};