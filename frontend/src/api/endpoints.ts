export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
  },
  ARTISTS: {
    LIST: '/api/artists',
    CREATE: '/api/artists',
    EXPORT_CSV: '/api/artists/export/csv',
    IMPORT_CSV: '/api/artists/import/csv',
  },
  SONGS: {
    LIST: '/api/songs',
    CREATE: '/api/songs',
    BY_ARTIST: '/api/songs/artist',
    DETAIL: '/api/songs',
    UPDATE: '/api/songs',
    DELETE: '/api/songs',
  },
}