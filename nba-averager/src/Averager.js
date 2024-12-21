import React, { useState, useEffect } from 'react';

export default function Averager() {
    const [games, setGames] = useState([]);
    const [statusMessage, setStatusMessage] = useState('No games are available at the moment');

    const apiKey = '3e3e71b15emsh7c021e765656a6ep1c69e0jsne152af09f765';
    const endpoint = 'https://api-nba-v1.p.rapidapi.com/games?live=all';

    async function fetchGameData() {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            });
            const data = await response.json();
            console.log('Fetched data:', data);
            return data.response.length ? data.response : null;
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    }

    function calculateTotalTimePassed(data) {
        let totalTimePassed = 0;
        for (let i = 0; i < data.periods.length; i++) {
            const period = data.periods[i];
            totalTimePassed += (period.totalMinutes - period.remainingMinutes);
        }
        return totalTimePassed;
    }

    function updateUI(data) {
        if (data && data.length) {
            const updatedGames = data.map((game, index) => {
                console.log('Processing game:', game);
                const awayTeam = game.teams.visitors; 
                const homeTeam = game.teams.home;
                const awayTeamScore = game.teams.visitors.score.total;
                const homeTeamScore = game.teams.home.score.total;
                const totalScore = awayTeamScore + homeTeamScore;
                const timeLeft = game.periods[game.periods.length - 1].remaining;
                const totalTimePassed = calculateTotalTimePassed(game);
                const averageScorePerMinute = totalScore / totalTimePassed;
                const minutesLeftInGame = 48 - totalTimePassed;
                const predictedFinalScore = averageScorePerMinute * 48;

                return {
                    id: index,
                    awayTeamName: awayTeam.nickname,
                    homeTeamName: homeTeam.nickname,
                    awayTeamLogo: awayTeam.logo,
                    homeTeamLogo: homeTeam.logo,
                    awayTeamScore,
                    homeTeamScore,
                    totalScore,
                    timeLeft,
                    averageScorePerMinute: averageScorePerMinute.toFixed(2),
                    predictedFinalScore: predictedFinalScore.toFixed(2),
                    minutesLeftInGame
                };
            });
        
            setGames(updatedGames);
            setStatusMessage('GAMES ARE LIVE');
        } else {
            setStatusMessage('No games are available at the moment');
        }
    }

    async function updateGameData() {
        const data = await fetchGameData();
        updateUI(data);
    }

    useEffect(() => {
        const interval = setInterval(updateGameData, 6500); // Update every 6.5 seconds
        return () => clearInterval(interval);
    }, []);

    const boxStyle = {
        border: '1px solid black',
        padding: '10px',
        margin: '10px',
    };

    const mainBoxStyle = {
        border: '1px solid black',
        padding: '20px',
        margin: '20px',
        textAlign: 'center',
        maxWidth: "80%",
        backgroundColor: '#D5DDCF',
        
    };

    const borderStyle = {
        width: "90%",
        borderWidth: '0.5px',
        border: "solid",
        borderRadius: "8px",
        margin: '3%',
        textAlign: 'center'
    }

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        textAlign: "center",
        fontFamily: 'serif, Monospace',
        fontSize: '200%',
        margin: '0 25% 0 25%',
        paddingLeft: '5%'
    }

    const logoStyle ={
        
        maxHeight: '150px',
        marginRight: '2px',
        paddingTop: '0px'
    }

    

    const statusStyle = 
    statusMessage === 'GAMES ARE LIVE' ? { color: 'green', padding: '10px 0 0 20px'} : { color: 'red', padding: '10px 0 0 20px'} 
    
    return (
        <div>
            <div>
                <div>
                    <div style={containerStyle}>
                        <img style={logoStyle} src='/nba-logo.png' alt="NBA Logo"></img>
                        <h1> over/under Calculator</h1>
                    </div>
                </div>
                <div style={borderStyle}>
                    <p style={statusStyle}>{statusMessage}</p>
                    {games.map(game => (
                        <div key={game.id} style={mainBoxStyle}>
                            <div style={boxStyle} className="box" id="away-team-score">Away Team Score: {game.awayTeamScore}</div>
                            <div style={boxStyle} className="box" id="home-team-score">Home Team Score: {game.homeTeamScore}</div>
                            <div style={boxStyle} className="box" id="total-score">Total Score: {game.totalScore}</div>
                            <div style={boxStyle} className="box" id="time-left">Time Left in Quarter: {game.timeLeft}</div>
                            <div style={boxStyle} className="box" id="average-score-per-minute">Average Score Per Minute: {game.averageScorePerMinute}</div>
                            <div style={boxStyle} className="box" id="predicted-final-score">Predicted Final Score: {game.predictedFinalScore}</div>
                            <div style={boxStyle} className="box" id="minutes-left-in-game">Minutes Left in Game: {game.minutesLeftInGame}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    
    );
}
