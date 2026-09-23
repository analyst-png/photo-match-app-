CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_url TEXT NOT NULL,
  faces TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  name TEXT
);

CREATE INDEX IF NOT EXISTS idx_photos_added_at ON photos (added_at DESC);
