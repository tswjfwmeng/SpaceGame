// spacegame.js

/*jslint devel: true, browser: true */
/*global window $*/

$(function () {
    "use strict";

    // spacegame global gameboard canvas context variable
    var gcontext = $("#gameboard").get(0).getContext("2d");

    // spacegame global functions
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function Missile(image_file, x_axis, y_axis, width, height) {

        var _top = x_axis;
        var _left = y_axis;
        var _width = width;
        var _height = height;
        var _img = document.createElement("img");
        var _visible = false;

        var my = {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            img: _img,
            visible: _visible
        };

        _img.src = image_file;

        my.left = function (value) {
            if (value === undefined) {
                return _left;
            }
            _left = value;

            return my;
        };

        my.top = function (value) {
            if (value === undefined) {
                return _top;
            }
            _top = value;

            return my;
        };

        my.width = function (value) {
            if (value === undefined) {
                return _width;
            }
            _width = value;

            return my;
        };

        my.height = function (value) {
            if (value === undefined) {
                return _height;
            }
            _height = value;

            return my;
        };

        my.img = function (value) {
            if (value === undefined) {
                return _img;
            }
            _img = value;

            return my;
        };

        my.visible = function (value) {
            if (value === undefined) {
                return _visible;
            }
            _visible = value;

            return my;
        };

        my.boundaryCheck = function () {

            if (_left < 0) {
                _left = 0;
            }

            if (_top < 0) {
                _top = 0;
            }

            if (_left + _width > $("#gameboard").get(0).width) {
                _left = $("#gameboard").get(0).width - _width;
            }
        };

        my.fire = function (keys, player_left, player_top) {
            var SPACEBAR_KEYCODE = 32;

            if (keys === SPACEBAR_KEYCODE) {
              if (!_visible) {
                _visible = true;
                _left = player_left;
                _top = player_top;
              }
            }
       };

        my.reset = function (player_left, player_top) {
           _visible = false;
           _left = player_left;
           _top = player_top;
        }

       my.moveBullet = function (paused) {
           var _rate = 5;

           if (!paused) {
             if (_visible) {
               _top -= _rate;
             }
           };
      }

        return my;
    }

    function Ship(image_file, x_axis, y_axis, width, height) {

        var _top = x_axis;
        var _left = y_axis;
        var _width = width;
        var _height = height;
        var _img = document.createElement("img");

        var my = {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            img: _img,
        };

        _img.src = image_file;


        my.left = function (value) {
            if (value === undefined) {
                return _left;
            }
            _left = value;

            return my;
        };

        my.top = function (value) {
            if (value === undefined) {
                return _top;
            }
            _top = value;

            return my;
        };

        my.width = function (value) {
            if (value === undefined) {
                return _width;
            }
            _width = value;

            return my;
        };

        my.height = function (value) {
            if (value === undefined) {
                return _height;
            }
            _height = value;

            return my;
        };

        my.img = function (value) {
            if (value === undefined) {
                return _img;
            }
            _img = value;

            return my;
        };

        my.boundaryCheck = function () {

            if (_left < 0) {
                _left = 0;
            }

            if (_top < 0) {
                _top = 0;
            }

            if (_left + _width > $("#gameboard").get(0).width) {
                _left = $("#gameboard").get(0).width - _width;
            }

        };



        my.navigate = function (keys) {
            var RIGHTARROW_KEYCODE = 39;
            var LEFTARROW_KEYCODE = 37;

            switch (keys) {
            case RIGHTARROW_KEYCODE:
                _left += 20;
                break;
            case LEFTARROW_KEYCODE:
                _left -= 20;
                break;
       }

        my.boundaryCheck();
        };

        my.moveRandom = function (paused) {
            if (!paused) {
                var left_rnd = Boolean(getRandomInt(0, 2));
                //var top_rnd = Boolean(getRandomInt(0, 2));
                if (left_rnd) {
                    _left -= getRandomInt(1, 10);
                } else {
                    _left += getRandomInt(1, 10);
                }
            }

            my.boundaryCheck();
        };
        return my;
    }

    // Constructor for Game object
    function Game() {

        // total points
        var _total_points = 0;

        // is the game paused?
        var _game_paused = false;

        // speed of background animation in ms (larger = slower)
        var _background_speed = 5000;

        // player ship
        var _player_ship = new Ship("images/car.png", $("#gameboard").get(0).height - 150, 250, 128, 128);

        // enemy ship
        var _enemy_ship = new Ship("images/enemy.png", 250, 800, 150, 78);

        // missile from player ship
        var _missile = new Missile("images/bullet.gif", $("#gameboard").get(0).height - 150, 150, 59, 59);

        var my = {
            total_points: _total_points,
            game_paused: _game_paused,
            background_speed: _background_speed,
            player_ship: _player_ship,
            enemy_ship: _enemy_ship,
        };

        my.total_points = function (value) {
            if (value === undefined) {
                return _total_points;
            }
            _total_points = value;

            return my;
        };

        my.game_paused = function (value) {
            if (value === undefined) {
                return _game_paused;
            }
            _game_paused = value;

            return my;
        };

        my.background_speed = function (value) {
            if (value === undefined) {
                return _background_speed;
            }
            _background_speed = value;

            return my;
        };


        my.player_ship = function (value) {
            if (value === undefined) {
                return _player_ship;
            }
            _player_ship = value;

            return my;
        };

        my.enemy_ship = function (value) {
            if (value === undefined) {
                return _enemy_ship;
            }
            _enemy_ship = value;

            return my;
        };

        // METHODS

        // display total points
        my.displayPoints = function () {
            gcontext.clearRect(0, 0, 200, 100);
            gcontext.fillStyle = "#ffffff";
            gcontext.fillRect(0, 0, 200, 100);
            gcontext.font = "30px Arial";
            gcontext.strokeText("Score: " + _total_points, 10, 50);
        };


        my.moveBackground = function () {
            if (!_game_paused) {
                var background_position = $("#universe")
                    .css("backgroundPosition")
                    .split(" ");
                var current_x = parseInt(background_position[0], 10);
                var current_y = parseInt(background_position[1], 10);
                var new_x = current_x - 1;
                var new_y = current_y;
                $("#universe").css({
                    "background-position": new_x + "px " + new_y + "px"
                });
            }
        };

        my.clearShips = function () {
            //remove ships from canvas
            gcontext.clearRect(
                _player_ship.left(),
                _player_ship.top(),
                _player_ship.width(),
                _player_ship.height()
            );

            gcontext.clearRect(
                _enemy_ship.left(),
                _enemy_ship.top(),
                _enemy_ship.width(),
                _enemy_ship.height()
            );

            gcontext.clearRect(
                _missile.left(),
                _missile.top(),
                _missile.width(),
                _missile.height()
            );
        };

        my.drawShips = function () {
            //redraw player ship and enemy ship on canvas
            gcontext.drawImage(
                _player_ship.img(),
                _player_ship.left(),
                _player_ship.top()
            );

            gcontext.drawImage(
                _enemy_ship.img(),
                _enemy_ship.left(),
                _enemy_ship.top()
            );

            if (_missile.visible()) {
              gcontext.drawImage(
                _missile.img(),
                _missile.left(),
                _missile.top()
              );
           }
        };

        my.checkKeys = function () {
            var ESCAPE_KEYCODE = 27;

            $(document).keydown(function (key_event) {
                if (key_event.which === ESCAPE_KEYCODE) {
                    if (_game_paused) {
                        _game_paused = false;
                        $("#pause").remove();
                    } else {
                        _game_paused = true;
                        var pause = $("<div>", {id: "pause"});
                        $("body").prepend(pause);
                    }
                } else if (!_game_paused) {
                    my.clearShips();

                    //update player ship position based on keys
                    _missile.fire(key_event.which, _player_ship.left(), _player_ship.top());
                    _player_ship.navigate(key_event.which);
                    my.displayPoints();
                    my.drawShips();
                }
            });
        };

        my.checkResize = function () {
            $(window).resize(function () {
                $("#gameboard").get(0).width = $("#universe").width();
                $("#gameboard").get(0).height = $("#universe").height();
                _player_ship.boundaryCheck();
                _enemy_ship.boundaryCheck();
                _missile.boundaryCheck();
            });
        };

        my.collisions = function () {
            if (!_game_paused && _missile.visible()) {

                if (
                    ((_missile.left() > _enemy_ship.left()) && (_missile.left() < (_enemy_ship.left() + _enemy_ship.width())))
                    &&
                    ((_missile.top() < _enemy_ship.top()) && (_missile.top() > (_enemy_ship.top() - _enemy_ship.height())))

                ) {
                    return true
                }
            } else {
                return false;
            }
        };

        my.play = function () {
            my.clearShips();
            _enemy_ship.moveRandom(_game_paused);
            _missile.moveBullet(_game_paused);

            if ((_missile.top() - _missile.height()) < 0) {
                _missile.reset(_player_ship.left(), _player_ship.top());
            }
            my.displayPoints();
            my.drawShips();
            if (my.collisions()) {
                _total_points += 1;
                my.displayPoints();
            }
        };
        return my;
    }

    // gameboard canvas
    $("#gameboard").get(0).width = $("#universe").width();
    $("#gameboard").get(0).height = $("#universe").height();

    var game = new Game();

    game.checkResize();
    game.checkKeys();
    setInterval(game.moveBackground, game.background_speed);
    setInterval(game.play, game.background_speed);
});
