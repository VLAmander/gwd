
var myApp = angular.module('myApp', []);

myApp.controller('mainController', function($scope,$timeout){

    $scope.gameTable = ["","","","","","","","",""];
    $scope.myMove = true;
    var you = "";
    var ai = "";
    var bestMove;

    $scope.choseMark = function (chose) {
        if (chose.target.className === "choseX") {
            you = "X"; ai = "O";
        } else {
            you = "O"; ai = "X";
        }
        $(".modal-wrap").slideUp(700,aiMove());
    }

    $scope.handleMoves = function (player,event) {
        if ($scope.myMove) {
            if ($scope.gameTable[player] === "") {
                $scope.gameTable[player] = you;
                $scope.myMove = false;
                handleWinner();
            }
        }
        if ((getPossibleMoves($scope.gameTable))[0] === undefined) {
            return;
        } else {
            $timeout(function(){
                aiMove();
                handleWinner();
            },1000)

        };
    };

    var aiMove = function () {
        if (!$scope.myMove) {
            bestMove= getMove($scope.gameTable);
            $scope.gameTable[bestMove] = ai;
            $scope.myMove = true;
        }
    }

    var handleWinner = function () {
        var isWinner = checkWiner($scope.gameTable);
        if (isWinner !== undefined ) {
            if (isWinner === -1) {
                $scope.result = "You Win!";
            } else if (isWinner === 1) {
                $scope.result = "Ai Wins!";
            } else if (isWinner === 0) {
                $scope.result = "It's A Tie";
            }
            $(".wrap span").css("pointer-events","none");
            $timeout(resetGameTable,3000);
        }
    }

    var checkWiner = function (board) {
        if (((board[0] === ai) && (board[1] === ai) && (board[2] === ai)) ||
            ((board[3] === ai) && (board[4] === ai) && (board[5] === ai)) ||
            ((board[6] === ai) && (board[7] === ai) && (board[8] === ai)) ||
            ((board[0] === ai) && (board[3] === ai) && (board[6] === ai)) ||
            ((board[1] === ai) && (board[4] === ai) && (board[7] === ai)) ||
            ((board[2] === ai) && (board[5] === ai) && (board[8] === ai)) ||
            ((board[0] === ai) && (board[4] === ai) && (board[8] === ai)) ||
            ((board[2] === ai) && (board[4] === ai) && (board[6] === ai))) {
            return 1;
        }
        if (((board[0] === you) && (board[1] === you) && (board[2] === you)) ||
            ((board[3] === you) && (board[4] === you) && (board[5] === you)) ||
            ((board[6] === you) && (board[7] === you) && (board[8] === you)) ||
            ((board[0] === you) && (board[3] === you) && (board[6] === you)) ||
            ((board[1] === you) && (board[4] === you) && (board[7] === you)) ||
            ((board[2] === you) && (board[5] === you) && (board[8] === you)) ||
            ((board[0] === you) && (board[4] === you) && (board[8] === you)) ||
            ((board[2] === you) && (board[4] === you) && (board[6] === you))) {
            return -1;  }
        if (getPossibleMoves(board).length === 0) {
            return 0;
        }
        return undefined;
    }

    var getPossibleMoves = function (board) {
        var possibleMoves = [];
        for (var i=0 ;i < board.length;i++) {
            if (board[i]  === "") {
                possibleMoves.push(i);
            }
        }
        return possibleMoves;
    };

    var getNextState = function (board,state,player) {
        var boardCopy = board.slice();
        boardCopy[state] = player;
        return boardCopy;
    };

    var resetGameTable = function () {
        $scope.gameTable = ["","","","","","","","",""];
        $scope.result = "";
        $(".wrap span").css("pointer-events","auto");
        aiMove();
    };

//------ Minimax logic------//

    var getMove = function(board) {
        var bestValue = -100;
        var move = 0;
        var moveArr = getPossibleMoves(board);
        for (var i=0; i < moveArr.length; i++) {
            var newBoard = getNextState(board,moveArr[i],ai);
            var v = minValue(newBoard);
            if (v > bestValue) {
                bestValue = v;
                move = moveArr[i];
            }
        }
        return move;
    };

    var minValue = function(board) {
        if (checkWiner(board) !== undefined) {
            return checkWiner(board);
        }
        var bestValue = 100;
        var move = 0;
        var moveArr = getPossibleMoves(board);
        for (var i=0; i < moveArr.length; i++) {
            var newBoard = getNextState(board,moveArr[i],you);
            var v = maxValue(newBoard);
            if (v < bestValue) {
                bestValue = v;
                move = moveArr[i];
            }
        }
        return bestValue;
    };

    var maxValue = function(board) {
        if (checkWiner(board) !== undefined) {
            return checkWiner(board);
        }
        var bestValue = -100;
        var move = 0;
        var moveArr = getPossibleMoves(board);
        for (var i=0; i < moveArr.length; i++) {
            var newBoard = getNextState(board,moveArr[i],ai);
            var v = minValue(newBoard);
            if (v > bestValue) {
                bestValue = v;
                move = moveArr[i];
            }
        }
        return bestValue;
    };

});