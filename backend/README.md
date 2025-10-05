# Air Quality Monitoring Backend Service

A production-ready FastAPI backend service that tracks air quality data for 50 major U.S. cities using the WAQI (World Air Quality Index) API.

## Features

- ✅ **Hourly Data Refresh**: Automatic background updates every hour
- ✅ **Redis Caching**: Fast data retrieval with Redis (or in-memory fallback)
- ✅ **50 U.S. Cities**: Pre-configured major cities with geo-coordinates
- ✅ **Historical Data**: Track up to 48 hours of historical air quality data
- ✅ **Clean REST API**: Well-documented endpoints for frontend integration
- ✅ **Lazy Loading**: Immediate data fetch on cache miss
- ✅ **Production Ready**: Proper error handling, logging, and monitoring

## Architecture

```
┌─────────────┐
│   FastAPI   │ ◄─── REST API Endpoints
└──────┬──────┘
       │
       ├─── Scheduler (APScheduler)
       │    └─── Hourly Background Jobs
       │
       ├─── WAQI Client
       │    └─── HTTP Calls to WAQI API
       │
       └─── Cache Manager
            └─── Redis / In-Memory Storage
```

## Prerequisites

- Python 3.10+
- Redis (optional, but recommended)
- WAQI API Token ([Get one here](https://aqicn.org/data-platform/token/))

## Installation

### 1. Clone and Setup

```bash
# Create project directory
mkdir air-quality-backend
cd air-quality-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your WAQI token
nano .env  # or use your preferred editor
```

Required environment variables:
```env
WAQI_TOKEN=your_actual_token_here
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_HOURS=48
LOG_LEVEL=INFO
```

### 3. Start Redis (Optional but Recommended)

**Using Docker:**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Or install locally:**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from: https://redis.io/download
```

**Without Redis:** The service will automatically use in-memory caching if Redis is unavailable.

## Running the Service

### Development Mode

```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Run with multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The service will be available at: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### Health Check
```http
GET /
```
Returns service health status.

### Get All Cities
```http
GET /api/cities
```
Returns list of all monitored cities with their stations.

**Response:**
```json
{
  "cities": [
    {
      "city": "Los Angeles",
      "station_id": "5724",
      "station_name": "Los Angeles-North Main Street"
    }
  ],
  "count": 50
}
```

### Get Nearby Stations (NEW!)
```http
GET /api/stations/nearby?lat=34.05&lon=-118.25&radius=0.5
```
Discover all available air quality stations near a location. Useful for finding alternative stations or exploring coverage.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate  
- `radius` (optional): Search radius in degrees (0.1-2.0, default 0.5 ≈ 55km)

**Response:**
```json
{
  "location": {"lat": 34.05, "lon": -118.25},
  "radius": 0.5,
  "count": 12,
  "stations": [
    {
      "station_id": "5724",
      "name": "Los Angeles-North Main Street",
      "aqi": 53,
      "lat": 34.0669,
      "lon": -118.2269
    }
  ]
}
```

### Get Air Quality by City
```http
GET /api/airquality?city=Los Angeles
```
Returns latest air quality data for the specified city.

**Response:**
```json
{
  "city": "Los Angeles",
  "station": "Los Angeles-North Main Street",
  "timestamp": "2025-10-05T08:00:00Z",
  "aqi": 53,
  "dominant": "pm25",
  "pollutants": {
    "pm25": 53,
    "pm10": 17,
    "no2": 7.8,
    "o3": 11,
    "so2": 3.6,
    "co": 5.5
  },
  "weather": {
    "temperature": 29,
    "humidity": 83,
    "wind": 1.5,
    "pressure": 1014
  },
  "forecast": {
    "pm25": [
      {"day": "2025-10-05", "avg": 166, "max": 177, "min": 141}
    ]
  }
}
```

### Get Station Data by ID
```http
GET /api/station/{station_id}
```
Returns latest data for a specific station ID.

### Get Historical Data
```http
GET /api/history?city=Los Angeles&hours=24
```
Returns historical air quality data for the past N hours (1-48).

**Response:**
```json
{
  "city": "Los Angeles",
  "station_id": "5724",
  "hours": 24,
  "data_points": 24,
  "history": [
    { /* StationData object */ }
  ]
}
```

### Get Service Statistics
```http
GET /api/stats
```
Returns service monitoring statistics.

## Project Structure

```
air-quality-backend/
├── main.py              # FastAPI application entry point
├── scheduler.py         # Background scheduler for data updates
├── waqi_client.py       # WAQI API client wrapper
├── cache_manager.py     # Redis/in-memory cache manager
├── models.py            # Pydantic data models
├── config.py            # Configuration settings
├── cities.json          # City coordinates configuration
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## How It Works

### 1. **Startup Process**
- Load 50 cities from `cities.json`
- Discover nearest WAQI station for each city
- Perform initial data fetch for all stations
- Start hourly background scheduler

### 2. **Background Updates**
- Every hour, fetch fresh data for all stations
- Parse AQI, pollutants, weather, and forecast
- Cache results in Redis with timestamp
- Maintain 48-hour rolling history

### 3. **API Requests**
- Serve data from cache (never hit WAQI in real-time)
- If cache miss: trigger immediate fetch (lazy loading)
- Return structured JSON response

### 4. **Cache Management**
- Redis keys: `airquality:{station_id}:{timestamp}`
- Latest data: `airquality:latest:{station_id}`
- History: Sorted set per station
- Auto-cleanup: Remove data older than 48 hours

## Configuration

### Adding/Modifying Cities

Edit `cities.json`:
```json
[
  {"city": "Your City", "lat": 40.7128, "lon": -74.0060}
]
```

Restart the service to apply changes.

### Adjusting Update Frequency

In `scheduler.py`, modify the interval:
```python
trigger=IntervalTrigger(hours=1)  # Change to desired interval
```

### Cache Duration

Set in `.env`:
```env
CACHE_TTL_HOURS=48  # Adjust retention period
```

## Monitoring and Logs

The service provides comprehensive logging:

```bash
# View logs
tail -f logs/app.log

# Check service stats
curl http://localhost:8000/api/stats
```

Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - WAQI_TOKEN=${WAQI_TOKEN}
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## Troubleshooting

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping`
- Check Redis URL in `.env`
- Service will fall back to in-memory cache automatically

### WAQI API Errors
- Verify token is valid
- Check API rate limits (typical: 1000 requests/day)
- Review logs for specific error messages

### Missing City Data
- Ensure city exists in `cities.json`
- Check if WAQI has stations near the coordinates
- Some cities may not have coverage

### Cache Not Updating
- Check scheduler logs
- Verify background tasks are running
- Restart service if needed

## Performance Notes

- **Response Time**: < 50ms (from cache)
- **Memory Usage**: ~100-200MB (with 50 cities)
- **Redis Storage**: ~5-10MB per 48 hours
- **Update Duration**: ~2-3 minutes for 50 cities

## License

MIT License - Feel free to use in your projects.

## Support

For issues or questions:
- Check the logs first
- Review API documentation at `/docs`
- Ensure all dependencies are installed
- Verify environment variables are set correctly

## Credits

- Air quality data provided by [WAQI](https://aqicn.org/)
- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Caching powered by [Redis](https://redis.io/)