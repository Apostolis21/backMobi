var ArenaQuestions = require('../models/activeArena');
var ArenaUser = require('../models/arena');
var Awards = require('../models/awards');
var Statistics = require('../models/statistics');
var User = require('../models/users');
var level;
var experience;


exports.awards = function (req, res, next) {
    var arenaId = req.body.arenaId;
    var userId = req.body.userId;
    Statistics.findOne({ user: userId }).exec(function (err, result) {

        if (err) {
            return res.status(500).json({
                message: 'Fail',
            });
        }
        if (!result) {
            var statistics = new Statistics({ user: userId });
            statistics.save();

            return res.status(200).json({
                message: 'success',
            });
        } else {
            return res.status(500).json({
                message: 'Fail',
            });
        }






    });

    Awards.findOne().where({ arenaId: arenaId })
        .exec(function (err, result) {
            console.log('inside')
            if (err) {
                return res.status(500).json({
                    message: 'Unexpected Error',
                });
            }

            if (result.awards.winner.userId == userId) {
                if (result.awards.winner.received != false) {
                    return res.status(500).json({
                        where: 'At awards',
                        title: 'Error',
                        message: 'You already received that award....',
                        status: '500'
                    });
                } else {
                    Statistics.findOne({ user: userId }).exec(function (err, statistics) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Unexpected Error',
                            });
                        }

                        statistics.currentExp = statistics.currentExp + result.awards.winner.experience;
                        statistics.wins = statistics.wins + 1;
                        console.log('here is level');
                        var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp);
                        statistics.currentExp = levelInfo.currentExperience;
                        statistics.level = levelInfo.level;
                        statistics.save();

                    });
                    User.findOne({ _id: userId })
                        .populate({ path: 'arenas', match: { _id: arenaId } })
                        .exec(function (err, user) {

                            if (err) {
                                return res.status(500).json({
                                    message: 'Unexpected Error',
                                });
                            }
                            result.awards.winner.received = true;
                            result.save();
                            user.arenas.pull({ _id: arenaId });
                            user.save();

                            return res.status(200).json({
                                message: 'success'
                            })
                        });

                }



            } else if (result.awards.loser.userId == userId) {

                if (result.awards.loser.received != false) {
                    return res.status(500).json({
                        where: 'At awards',
                        title: 'Error',
                        message: 'You already received that award....',
                        status: '500'
                    });

                } else {
                    Statistics.findOne({ user: userId }).exec(function (err, statistics) {

                        if (err) {
                            return res.status(500).json({
                                message: 'Unexpected Error',
                            });
                        }

                        statistics.currentExp = statistics.currentExp + result.awards.loser.experience;
                        statistics.loses = statistics.loses + 1;
                        console.log('here is level');
                        var levelInfo = require('./LevelUp')(statistics.level, statistics.currentExp);
                        statistics.currentExp = levelInfo.currentExperience;
                        statistics.level = levelInfo.level;

                        statistics.save();


                    });
                    User.findOne({ _id: userId })
                        .populate({ path: 'arenas', match: { _id: arenaId } })
                        .exec(function (err, user) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Unexpected Error',
                                });
                            }
                            result.awards.loser.received = true;
                            result.save();
                            user.arenas.pull({ _id: arenaId });
                            user.save();
                            return res.status(200).json({
                                message: 'success'
                            })
                        });
                }
            }else {
                Statistics.findOne({ user: userId }).exec(function (err, statistics) {
                    if (result.awards.draw.receivedP2 == userId) {
                        return res.status(500).json({
                            where: 'Awards',
                            message: 'Award already received',
                        });
                    } else if (result.awards.draw.receivedP1 == userId) {
                        return res.status(500).json({
                            where: 'Awards',
                            message: 'Award already received',
                        });
                    } else {
                        statistics.currentExp = statistics.currentExp + result.awards.draw.experience;
                        statistics.points = statistics.points + 1;
                        statistics.draws = statistics.draws + 1;
                        console.log('here is level');
                        var levelInfo = require('./checkLevelUp')(statistics.level, statistics.currentExp);
                        statistics.currentExp = levelInfo.currentExperience;
                        statistics.level = levelInfo.level;
                        statistics.save();

                        if (result.awards.draw.receivedP1 == '123') {
                            result.awards.draw.receivedP1 = userId;
                            result.save();
                            return res.status(200).json({
                                message: 'success'
                            })
                        }

                        else if (result.awards.draw.receivedP2 == '123') {
                            result.awards.draw.receivedP2 = userId;
                            result.save();
                            return res.status(200).json({
                                message: 'success'
                            })
                        } else {
                            return res.status(500).json({
                                where: 'Awards',
                                message: 'Unexpected error',
                            });
                        }

                    }
                });
            }
            ArenaUser.findOne({ _id: arenaId })
                .exec(function (err, arena) {
                    console.log('Arenas delete')

                    if (err) {
                        return res.status(500).json({
                            message: 'Unexpected Error',
                        });
                    }
                    if (result.awards.draw.receivedP2 != '123' && result.awards.draw.receivedP1 != '123'
                        || result.awards.winner.received == true && result.awards.loser.received == true) {
                        arena.remove();
                        result.remove();

                    }
                });

        }

