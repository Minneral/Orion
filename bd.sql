USE orion;
CREATE TABLE users (
    id INT PRIMARY KEY auto_increment,
    username VARCHAR(128),
    email VARCHAR(255),
    profile_name varchar(64),
    subscription_level VARCHAR(64),
    passwordHASH VARCHAR(128),
    salt VARCHAR(128)
);

CREATE TABLE subscription_levels
(
	id INT PRIMARY KEY auto_increment,
    level_name varchar(64) unique,
    level_power int
);

CREATE TABLE movies (
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(100),
    description varchar(2048),
    duration TIME,
    director varchar(128),
    access_level VARCHAR(64),
    price DECIMAL(5,2) default null,
    banner_url varchar(255),
    title_url varchar(255),
    FOREIGN KEY (access_level) REFERENCES subscription_levels(level_name) on delete cascade
);

CREATE TABLE series (
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(255),
    description varchar(2048),
    director varchar(64),
    access_level VARCHAR(64),
    price DECIMAL(5,2) default null,
    banner_url varchar(255),
    title_url varchar(255),
    FOREIGN KEY (access_level) REFERENCES subscription_levels(level_name) on delete cascade
);

CREATE TABLE series_episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    series_id INT,
    season_number INT,
    episode_number INT,
    title VARCHAR(255),
    duration TIME,
    FOREIGN KEY (series_id) REFERENCES series(id) on delete cascade
);

CREATE TABLE reviews (
    id INT PRIMARY KEY auto_increment,
    user_id INT,
    movie_id INT,
    series_id INT,
    rating INT,
    isFavorite boolean DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY (movie_id) REFERENCES movies(id) on delete cascade,
    FOREIGN KEY (series_id) REFERENCES series(id) on delete cascade
);

CREATE TABLE user_history (
    id INT PRIMARY KEY auto_increment,
    user_id INT,
    movie_id INT,
    series_id INT,
    last_watched TIMESTAMP,
    last_episode INT default null,
    FOREIGN KEY (user_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY (movie_id) REFERENCES movies(id) on delete cascade,
    FOREIGN KEY (series_id) REFERENCES series(id) on delete cascade
);

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(128) NOT NULL
);

CREATE TABLE content_genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    series_id INT,
    genre_id INT,
    FOREIGN KEY (movie_id) REFERENCES movies(id) on delete cascade,
    FOREIGN KEY (series_id) REFERENCES series(id) on delete cascade,
    FOREIGN KEY (genre_id) REFERENCES genres(id) on delete cascade
);

