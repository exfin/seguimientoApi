import { useState, useEffect } from "react";
import { Player } from "./Player";
import { playerDB } from "../models/player.nodel";
import './styles/ShowPlayers.css';

export const ShowPlayers = () => {
    const [players, setPlayers] = useState<playerDB[]>([]);
    const [number, setNumber] = useState<number | "">(""); 
    const [playerPairs, setPlayerPairs] = useState<{ player1: playerDB, player2: playerDB }[]>([]);

    const getPlayers = async () => {
        try {
            const response = await fetch('https://mach-eight.uc.r.appspot.com/');
            const data = await response.json();
            const values = data.values;

            if (values) {
                setPlayers(values);
            } else {
                console.error("Error");
            }
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    useEffect(() => {
        getPlayers();
    }, []);

    function findPairs() {
        if (typeof number !== 'number' || isNaN(number)) {
            console.log("Number is not valid:", number);
            return [];
        }

        const pairs: { player1: playerDB, player2: playerDB }[] = [];
        const uniquePairs: { [key: number]: boolean } = {};

        const sortedPlayers = [...players].sort((a, b) => a.h_in - b.h_in);

        let low = 0;
        let high = sortedPlayers.length - 1;

        while (low < high) {
            const lowHeight = Number(sortedPlayers[low].h_in);
            const highHeight = Number(sortedPlayers[high].h_in);
            const sum = lowHeight + highHeight;

            if (sum === number) {
                if (!uniquePairs[lowHeight] || !uniquePairs[highHeight]) {
                    
                    uniquePairs[lowHeight] = true;
                    uniquePairs[highHeight] = true;

                    pairs.push({
                        player1: sortedPlayers[low],
                        player2: sortedPlayers[high],
                    });
                }
                low++;
                high--;
            } else if (sum > number) {
                high--;
            } else {
                low++;
            }
        }

        console.log("Pairs found:", pairs);
        return pairs;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (typeof number === 'number' && !isNaN(number)) {
            const pairs = findPairs();
            setPlayerPairs(pairs);
        } else {
            console.log('Invalid number or empty input');
        }
    }

    return (
        <div className="players-container">
            <form onSubmit={handleSubmit}>
                <input 
                    type='number'
                    value={number} 
                    onChange={(e) => setNumber(e.target.value ? parseInt(e.target.value) : "")} 
                />
                <button type="submit">Confirmar</button>
            </form>

            <div className="player-pairs">
                {playerPairs.length > 0 ? (
                    playerPairs.map((pair, index) => (
                        <div key={index} className="player-pair">
                            <Player player={pair.player1} />
                            
                            <Player player={pair.player2} />
                        </div>
                    ))
                ) : (
                    <p>No pairs found.</p>
                )}
            </div>
        </div>
    );
}
