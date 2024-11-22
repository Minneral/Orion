import datetime
from functools import wraps
import secrets
from flask import Flask, jsonify, make_response, request, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import extract
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import bleach
import os
import base64

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = (
    "ce2cc6c18eb1f7d11f5dd0dc0c1f01620a06724bf7627f75960bd461f129b01c"
)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:minneral@localhost/orion"

db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128))
    email = db.Column(db.String(255))
    profile_name = db.Column(db.String(64))
    subscription_level = db.Column(
        db.String(64), db.ForeignKey("subscription_levels.level_name")
    )
    passwordHASH = db.Column(db.String(128))
    salt = db.Column(db.String(128))


class Movies(db.Model):
    __tablename__ = "movies"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(255))
    duration = db.Column(db.Time)
    director = db.Column(db.String(64))
    date = db.Column(db.Integer)
    access_level = db.Column(
        db.String(64), db.ForeignKey("subscription_levels.level_name")
    )
    price = db.Column(db.Numeric(5, 2), default=None)
    banner_url = db.Column(db.String(255))
    title_url = db.Column(db.String(255))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'duration': str(self.duration),
            'director': self.director,
            'date': self.date,
            'access_level': self.access_level,
            'price': str(self.price),
            'banner_url': self.banner_url,
            'title_url': self.title_url
        }


class Series(db.Model):
    __tablename__ = "series"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(255))
    director = db.Column(db.String(64))
    access_level = db.Column(
        db.String(64), db.ForeignKey("subscription_levels.level_name")
    )
    price = db.Column(db.Numeric(5, 2), default=None)
    banner_url = db.Column(db.String(255))
    title_url = db.Column(db.String(255))


class UserHistory(db.Model):
    __tablename__ = "user_history"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"))
    series_id = db.Column(db.Integer, db.ForeignKey("series.id"))
    last_watched = db.Column(db.DateTime)
    last_episode = db.Column(db.Integer, default=None)


class Reviews(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"))
    series_id = db.Column(db.Integer, db.ForeignKey("series.id"))
    rating = db.Column(db.Integer)
    isFavorite = db.Column(db.Boolean, default=False)


class SubscriptionLevels(db.Model):
    __tablename__ = "subscription_levels"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    level_name = db.Column(db.String(64), unique=True)
    level_power = db.Column(db.Integer)


class Genres(db.Model):
    __tablename__ = "genres"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    genre_name = db.Column(db.String(100), nullable=False)


class ContentGenres(db.Model):
    __tablename__ = "content_genres"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"))
    series_id = db.Column(db.Integer, db.ForeignKey("series.id"))
    genre_id = db.Column(db.Integer, db.ForeignKey("genres.id"))


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            bearer_token = request.headers["Authorization"]
            if bearer_token.startswith("Bearer "):
                token = bearer_token[7:]

        if not token:
            return jsonify({"message": "Токен отсутствует!"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = Users.query.filter_by(id=data["user_id"]).first()
        except:
            return jsonify({"message": "Токен недействителен!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def needle_fields(required_fields):
    data = request.get_json()

    if not data:
        return False, "Данные не были отправлены"

    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return False, f'Отсутствуют поля: {", ".join(missing_fields)}'

    empty_fields = [field for field in required_fields if not data[field]]

    if empty_fields:
        return False, f'Заполните поля: {", ".join(empty_fields)}'

    return True, None


@app.route("/")
@token_required
def hello(user):
    return "Hello, " + user.username


@app.route("/user", methods=["GET"])
@token_required
def get_user(user):
    if user is None:
        return "", 401
    else:
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile_name": user.profile_name,
            "subscription_level": user.subscription_level,
        }
        return jsonify(user_data)


@app.route("/movies", methods=["GET"])
@token_required
def get_movies(user):
    movies = Movies.query.all()
    output = []
    for movie in movies:
        movie_data = {}
        movie_data["id"] = movie.id
        movie_data["title"] = movie.title
        movie_data["description"] = movie.description
        movie_data["duration"] = movie.duration.strftime("%H:%M:%S")
        movie_data["director"] = movie.director
        movie_data["access_level"] = movie.access_level
        movie_data["price"] = movie.price
        movie_data["banner_url"] = movie.banner_url
        movie_data["title_url"] = movie.title_url
        output.append(movie_data)
    return jsonify({"movies": output})


@app.route("/movies/<movie_id>", methods=["GET"])
@token_required
def get_movie(user, movie_id):
    movie = Movies.query.filter_by(id=movie_id).first()
    if not movie:
        return jsonify({"message": "Фильма с таким id не существует"})

    movie_data = {}
    movie_data["id"] = movie.id
    movie_data["title"] = movie.title
    movie_data["description"] = movie.description
    movie_data["duration"] = movie.duration.strftime("%H:%M:%S")
    movie_data["director"] = movie.director
    movie_data["access_level"] = movie.access_level
    movie_data["price"] = movie.price
    movie_data["banner_url"] = movie.banner_url
    movie_data["title_url"] = movie.title_url

    return jsonify({"movie": movie_data})


@app.route("/series", methods=["GET"])
@token_required
def get_series(user):
    series = Series.query.all()
    output = []
    for serie in series:
        serie_data = {}
        serie_data["id"] = serie.id
        serie_data["title"] = serie.title
        serie_data["description"] = serie.description
        serie_data["director"] = serie.director
        serie_data["access_level"] = serie.access_level
        serie_data["price"] = str(serie.price)
        serie_data["banner_url"] = serie.banner_url
        serie_data["title_url"] = serie.title_url
        output.append(serie_data)
    return jsonify({"series": output})


@app.route("/series/<series_id>", methods=["GET"])
@token_required
def get_serie(user, series_id):
    serie = Series.query.filter_by(id=series_id).first()
    if not serie:
        return jsonify({"message": "Сериала с таким id не существует"})

    serie_data = {}
    serie_data["id"] = serie.id
    serie_data["title"] = serie.title
    serie_data["description"] = serie.description
    serie_data["director"] = serie.director
    serie_data["access_level"] = serie.access_level
    serie_data["price"] = str(serie.price)
    serie_data["banner_url"] = serie.banner_url
    serie_data["title_url"] = serie.title_url

    return jsonify({"serie": serie_data})


@app.route("/video")
def get_video():
    return send_file("./media/movies/Уроки фарси/video.mp4", mimetype="video/mp4")


@app.route("/watched", methods=["POST"])
@token_required
def set_watched(user):

    valid, message = needle_fields(["id", "type"])
    if not valid:
        return jsonify({"message": message}), 401

    data = request.get_json()
    movie_id = data["id"] if data["type"] == "movie" else None
    series_id = data["id"] if data["type"] == "series" else None

    userHistory = UserHistory.query.filter_by(
        user_id=user.id, movie_id=movie_id, series_id=series_id
    ).first()

    if userHistory is None:
        userHistory = UserHistory(
            user_id=user.id, movie_id=movie_id, series_id=series_id
        )
        db.session.add(userHistory)
    else:
        userHistory.movie_id = movie_id
        userHistory.series_id = series_id

    db.session.commit()

    return jsonify({"message": "movie set as watched"})


@app.route("/review", methods=["POST"])
@token_required
def set_favorite(user):
    valid, message = needle_fields(["id", "type", "rating", "isFavorite"])
    if not valid:
        return jsonify({"message": message}), 406

    data = request.get_json()
    movie_id = data["id"] if data["type"] == "movie" else None
    series_id = data["id"] if data["type"] == "series" else None
    isFavorite = data["isFavorite"].lower() == "true"

    review = Reviews.query.filter_by(
        user_id=user.id, movie_id=movie_id, series_id=series_id
    ).first()

    if review is None:
        review = Reviews(
            user_id=user.id,
            movie_id=movie_id,
            series_id=series_id,
            rating=data["rating"],
            isFavorite=isFavorite,
        )
        db.session.add(review)
    else:
        review.movie_id = movie_id
        review.series_id = series_id
        review.rating = data["rating"]
        review.isFavorite = isFavorite

    db.session.commit()

    return jsonify({"message": "Таблица отзывов обновлена " + str(isFavorite)})


@app.route("/review", methods=["GET"])
@token_required
def get_favorites(user):
    reviews = Reviews.query.filter_by(user_id=user.id).all()
    output = []
    for review in reviews:
        movie_data = {}
        movie_data["movie_id"] = review.movie_id
        movie_data["series_id"] = review.series_id
        movie_data["rating"] = review.rating
        movie_data["isFavorite"] = review.isFavorite

        output.append(movie_data)

    return jsonify({"reviews": output})


@app.route("/avatar", methods=["GET"])
@token_required
def get_avatar(user):
    defaultPath = "./avatars/default.jpg"
    userPath = "./avatars/user_" + str(user.id) + ".jpg"

    isAvatarExists = os.path.exists(userPath)
    if isAvatarExists:
        return send_file(userPath, mimetype="image/jpeg")
    else:
        return send_file(defaultPath, mimetype="image/jpeg")


@app.route("/avatar", methods=["POST"])
@token_required
def set_avatar(user):
    valid, message = needle_fields(["image"])
    if not valid:
        return jsonify({"message": message}), 406

    data = request.json["image"]
    if data.startswith("data:image/png;base64,"):
        data = data[len("data:image/png;base64,") :]
    img_data = base64.b64decode(data)
    userPath = "./avatars/user_" + str(user.id) + ".jpg"
    with open(userPath, "wb") as f:
        f.write(img_data)
    return {"message": "Image saved"}, 200


@app.route("/search", methods=["POST"])
@token_required
def search_movies(user):

    valid, message = needle_fields(["search"])
    if not valid:
        return jsonify({"message": message}), 406

    needle = request.get_json()["search"]

    movies = Movies.query.filter(Movies.title.ilike(f"%{needle}%")).all()
    series = Series.query.filter(Series.title.ilike(f"%{needle}%")).all()

    movieOutput = []
    for movie in movies:
        movie_data = {}
        movie_data["id"] = movie.id
        movie_data["title"] = movie.title
        movie_data["description"] = movie.description
        movie_data["duration"] = movie.duration.strftime("%H:%M:%S")
        movie_data["director"] = movie.director
        movie_data["access_level"] = movie.access_level
        movie_data["price"] = movie.price
        movie_data["banner_url"] = movie.banner_url
        movie_data["title_url"] = movie.title_url
        movieOutput.append(movie_data)

    seriesOutput = []
    for serie in series:
        serie_data = {}
        serie_data["id"] = serie.id
        serie_data["title"] = serie.title
        serie_data["description"] = serie.description
        serie_data["director"] = serie.director
        serie_data["access_level"] = serie.access_level
        serie_data["price"] = serie.price
        serie_data["banner_url"] = serie.banner_url
        serie_data["title_url"] = serie.title_url
        seriesOutput.append(serie_data)

    combined = {"movies": movieOutput, "series": seriesOutput}

    return jsonify(combined), 200


@app.route("/favorite", methods=["GET"])
@token_required
def get_favorite(user):
    favorites = Reviews.query.filter_by(user_id=user.id, isFavorite=True).all()

    output = []
    for favorite in favorites:
        favorite_data = {}
        favorite_data["movie_id"] = favorite.movie_id
        favorite_data["series_id"] = favorite.series_id
        output.append(favorite_data)
        # Если movie_id установлен, получить banner_url из таблицы Movies
        if favorite.movie_id:
            movie = Movies.query.get(favorite.movie_id)
            favorite_data["banner_url"] = movie.banner_url if movie else None
            favorite_data["access_level"] = movie.access_level if movie else None

        # Если series_id установлен, получить banner_url из таблицы Series
        elif favorite.series_id:
            series = Series.query.get(favorite.series_id)
            favorite_data["banner_url"] = series.banner_url if series else None

    return jsonify({"favorite": output}), 200

@app.route("/genres", methods=["GET"])
@token_required
def get_genres(user):
    genres = Genres.query.filter_by().all()
    output = []
    for genre in genres:
        output.append(genre.genre_name)
    
    return jsonify({"genres": output}), 200


@app.route("/watched", methods=["GET"])
@token_required
def get_watched(user):
    watched = UserHistory.query.filter_by(user_id=user.id).all()

    output = []
    for watch in watched:
        watched_data = {}
        watched_data["movie_id"] = watch.movie_id
        watched_data["series_id"] = watch.series_id
        watched_data["last_watched"] = watch.last_watched
        watched_data["last_episode"] = watch.last_episode

        # Если movie_id установлен, получить banner_url из таблицы Movies
        if watch.movie_id:
            movie = Movies.query.get(watch.movie_id)
            watched_data["banner_url"] = movie.banner_url if movie else None

        # Если series_id установлен, получить banner_url из таблицы Series
        elif watch.series_id:
            series = Series.query.get(watch.series_id)
            watched_data["banner_url"] = series.banner_url if series else None

        output.append(watched_data)

    return jsonify({"watched": output}), 200


@app.route("/edit", methods=["POST"])
@token_required
def edit_password(user):
    valid, message = needle_fields(["oldPassword", "newPassword"])
    if not valid:
        return jsonify({"message": message}), 406

    data = request.get_json()

    if check_password_hash(user.passwordHASH, data["oldPassword"] + user.salt):
        _user = Users.query.filter_by(id=user.id).first()
        _user.passwordHASH = generate_password_hash(
            data["newPassword"] + user.salt, method="pbkdf2:sha256"
        )
        db.session.add(_user)
        db.session.commit()
        return jsonify({"message": "Пароль изменен"}), 200
    else:
        return jsonify({"message": "Неверный старый пароль!"}), 406


@app.route("/settings", methods=["POST"])
@token_required
def settings_user(user):
    valid, message = needle_fields(["email"])
    if not valid:
        return jsonify({"message": message}), 406

    data = request.get_json()
    email = data["email"] if "email" in data and data["email"] else user.email
    profile_name = (
        data["profile_name"]
        if "profile_name" in data and data["profile_name"]
        else None
    )

    _user = Users.query.filter_by(id=user.id).first()
    _user.email = email
    _user.profile_name = profile_name

    db.session.add(_user)
    db.session.commit()
    return jsonify({"message": "Данные обновлены"}), 201


@app.route("/subscription", methods=["POST"])
@token_required
def set_subscription(user):
    valid, message = needle_fields(["subscription_level"])
    if not valid:
        return jsonify({"message": message}), 406

    level = request.get_json()["subscription_level"]
    _levels = SubscriptionLevels.query.all()
    _levels = [item.level_name for item in _levels]

    if level not in _levels:
        return jsonify({"message": "Неизвестный уровень доступа!"}), 406

    _user = Users.query.get(user.id)
    _user.subscription_level = level

    db.session.add(_user)
    db.session.commit()

    return jsonify({"message": "Уровень доступа обновлен"}), 200


@app.route("/filter", methods=["POST"])
@token_required
def get_filter(user):
    # valid, message = needle_fields(["date", "genres"])
    # if not valid:
    #     return jsonify({"message": message}), 406

    data = request.get_json()
    year = data.get("date")
    genres = data.get("genres")

    query = db.session.query(Movies).join(ContentGenres, Movies.id == ContentGenres.movie_id)

    if year:
        year = int(year)
        query = query.filter(Movies.date == year)

    if genres:
        genres = [genre.strip() for genre in genres.split(",")]

        genre_ids = db.session.query(Genres.id).filter(Genres.genre_name.in_(genres)).all()

        query = query.filter(ContentGenres.genre_id.in_(genre_ids[0]))

    movies = query.all()

    result = [movie.to_dict() for movie in movies]

    return jsonify({"movies": result}), 200




@app.route("/register", methods=["POST"])
def create_user():

    valid, message = needle_fields(["username", "email", "password"])
    if not valid:
        return jsonify({"message": message}), 406

    data = request.get_json()
    user = Users.query.filter_by(username=data["username"]).first()
    if user is not None:
        return jsonify({"message": "Пользователь с таким именем уже существует!"}), 406

    salt = secrets.token_hex(32)
    data = request.get_json()
    hash_password = generate_password_hash(
        data["password"] + salt, method="pbkdf2:sha256"
    )

    new_user = Users(
        username=data["username"],
        email=data["email"],
        subscription_level="Базовый",
        passwordHASH=hash_password,
        salt=salt,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "new user created"})


@app.route("/login", methods=["GET", "POST", "OPTION"])
def login():
    valid, message = needle_fields(["username", "password"])
    if not valid:
        return jsonify({"message": message}), 401

    auth = request.get_json()

    user = Users.query.filter_by(username=auth["username"]).first()
    # check if user is available or not
    if not user:
        return make_response(
            {"message": "Неверное имя пользователя или пароль"},
            401,
            {"WWW-Authenticate": 'Basic reaml= "Login required"'},
        )

    # check if password is correct
    hashed_input_password = generate_password_hash(
        auth["password"] + user.salt, method="pbkdf2:sha256"
    )

    if check_password_hash(user.passwordHASH, auth["password"] + user.salt):
        token = jwt.encode(
            {
                "user_id": user.id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            },
            app.config["SECRET_KEY"],
        )

        return jsonify({"token": token})
    return make_response(
        {"message": "Неверное имя пользователя или пароль"},
        401,
        {"WWW-Authenticate": 'Basic reaml= "Login required"'},
    )


if __name__ == "__main__":
    app.run(debug=True)
