-- Drop tables in reverse order to handle dependencies
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS seasons;

-- Drop UUID extension if no other tables are using it
DROP EXTENSION IF EXISTS "uuid-ossp";